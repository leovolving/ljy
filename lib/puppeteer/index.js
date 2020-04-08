const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {width: 1000, height: 600}
      });
    console.log('chromium created')
    const page = await browser.newPage();
    console.log('new page loaded')
    await page.goto('https://www.ayeeffie.com/');
    console.log('Efas website loaded')
  
    await page.focus('#comp-jun9g2kzinput');
  
    // first name input
    await page.type('#comp-jun9g2kzinput', 'Leo', {delay: 100});
    // last name input
    await page.type('#comp-jun9g3wzinput', new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}), {delay: 100});
    // email address input
    await page.type('#comp-jun9fokninput', 'leo@leoyockey.com', {delay: 100});
    // subject input
    await page.type('#comp-jun9fokpinput', 'TEST', {delay: 100});
    // email body text area
    await page.type('#comp-jun9gw2xtextarea', 'This is a test email sent locally by Puppeteer.', {delay: 100});
  
    // send message
    await page.click('#comp-jun9fokslink', {delay: 100});
    console.log('form submitted')

    await browser.close();
})();