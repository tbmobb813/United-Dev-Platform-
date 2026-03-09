import { test, expect } from '@playwright/test';

test('collaborative editor syncs between two clients', async ({ browser }) => {
    const room = 'playwright-room';
    const doc = 'playwright-doc';
    const url = `http://localhost:3000/?room=${encodeURIComponent(room)}&doc=${encodeURIComponent(doc)}`;

    // Create two isolated contexts to simulate two different browser tabs/users
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Ensure both pages will render the client editor by setting a userName
    await pageA.addInitScript(() => localStorage.setItem('userName', 'playwright-A'));
    await pageB.addInitScript(() => localStorage.setItem('userName', 'playwright-B'));

    // Pipe browser console messages to the test runner for debugging and wait
    // for the websocket provider to report connection status.
    pageA.on('console', msg => console.log('[A console] ' + msg.text()));
    pageB.on('console', msg => console.log('[B console] ' + msg.text()));

    // Navigate both pages to the same document. Use 'load' to avoid waiting on
    // long-lived network activity (websockets can prevent 'networkidle').
    await Promise.all([
        pageA.goto(url, { waitUntil: 'load', timeout: 30000 }),
        pageB.goto(url, { waitUntil: 'load', timeout: 30000 }),
    ]);

    // Wait for Monaco editor to be visible on both pages (increase timeout)
    await Promise.all([
        pageA.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 30000 }),
        pageB.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 30000 }),
    ]);

    // Helper to read the visible editor text by concatenating view-line elements
    const readEditorText = async (page: any) => {
        await page.waitForTimeout(500); // small debounce for DOM updates
        const lines = await page.locator('.view-line').allTextContents();
        return lines.join('\n').trim();
    };

    // Programmatically set the editor value in pageA via the global monaco API.
    // This avoids issues with synthetic keyboard events and focuses.
    const message = 'Playwright sync test — hello from A';
    const beforeModels = await pageA.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m: any = (globalThis as any).monaco;
        if (!m || !m.editor) return { count: 0, values: [] };
        const models = m.editor.getModels();
        return { count: models.length, values: models.map((md: any) => md.getValue()) };
    });
    console.log('A models before:', beforeModels);

    await pageA.evaluate((msg) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m: any = (globalThis as any).monaco;
        if (!m || !m.editor) return false;
        const models = m.editor.getModels();
        if (models && models.length > 0) {
            models[0].setValue(msg);
            return true;
        }
        return false;
    }, message);

    const afterModels = await pageA.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m: any = (globalThis as any).monaco;
        if (!m || !m.editor) return { count: 0, values: [] };
        const models = m.editor.getModels();
        return { count: models.length, values: models.map((md: any) => md.getValue()) };
    });
    console.log('A models after:', afterModels);

    // Wait a short while for Yjs/WebSocket synchronization to propagate
    await pageB.waitForTimeout(3000);

    // Also capture any provider status messages (helpful for debugging). If the
    // provider logs a connected status, that increases confidence sync can
    // happen.
    try {
        await pageA.waitForEvent('console', {
            predicate: m => m.text().toLowerCase().includes('websocket status') || m.text().toLowerCase().includes('websocket'),
            timeout: 3000,
        });
    } catch (e) {
        // ignore timeout — we'll still check the editor text
    }

    const textB = await readEditorText(pageB);
    const yTextB = await pageB.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (globalThis as any).__udp_test ? (globalThis as any).__udp_test.getYText() : null;
    });
    console.log('B Y.Text via debug API:', yTextB);
    expect(textB).toContain('Playwright sync test');
    expect(textB).toContain('hello from A');

    // Cleanup
    await contextA.close();
    await contextB.close();
});
