import { chromium } from 'playwright';

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

    console.log('Visiting home page...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Unified Dev Platform', { timeout: 15000 });
    console.log('Home heading visible');

    await browser.close();
    console.log('Smoke checks passed');
    process.exit(0);
  } catch (err) {
    console.error('Smoke checks failed:', err);
    await browser.close();
    process.exit(1);
  }
})();
