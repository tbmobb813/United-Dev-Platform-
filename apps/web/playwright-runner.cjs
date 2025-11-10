const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  try {
    console.log('Visiting login page...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle',
    });
    await page.waitForSelector('text=Sign in with GitHub', { timeout: 10000 });
    console.log('Login button visible');

    console.log(
      'Set a test user in localStorage so public simple page will render'
    );
    await page.evaluate(() =>
      localStorage.setItem('userName', 'playwright-test')
    );
    console.log('Visiting simple public page...');
    await page.goto('http://localhost:3000/simple', {
      waitUntil: 'networkidle',
    });
    await page.waitForSelector('text=Simple Unified Dev Platform (Web)', {
      timeout: 15000,
    });
    console.log('Simple page heading visible');

    await browser.close();
    console.log('Smoke checks passed');
    process.exit(0);
  } catch (err) {
    console.error('Smoke checks failed:', err);
    await browser.close();
    process.exit(1);
  }
})();
