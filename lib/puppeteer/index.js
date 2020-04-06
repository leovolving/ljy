const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const doTheThing = async () => {
    console.log('in doTheThing')
    const browser = await puppeteer.launch({
        // https://github.com/puppeteer/puppeteer/issues/1523#issuecomment-608133987
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--disable-gpu'],
        defaultViewport: {width: 1000, height: 600},
        executablePath: await chromium.executablePath,
        headless: chromium.headless
      });
    console.log('chromium created')
    const page = await browser.newPage();
    console.log('new page loaded')
    await page.goto('https://www.ayeeffie.com/');
    console.log('Efas website loaded')
  
    await page.focus('#comp-jun9g2kzinput');
  
    // first name input
    await page.type('#comp-jun9g2kzinput', 'AWS Leo', {delay: 100});
    // last name input
    await page.type('#comp-jun9g3wzinput', 'AWS Yockey', {delay: 100});
    // email address input
    await page.type('#comp-jun9fokninput', 'leo@leoyockey.com', {delay: 100});
    // subject input
    await page.type('#comp-jun9fokpinput', 'AWS TEST', {delay: 100});
    // email body text area
    await page.type('#comp-jun9gw2xtextarea', 'This is a test email sent programatically by Puppeteer and AWS.', {delay: 100});
  
    // send message
    await page.click('#comp-jun9fokslink', {delay: 100});
    console.log('form submitted')

    return await browser.close();
}

exports.handler = async () => doTheThing();