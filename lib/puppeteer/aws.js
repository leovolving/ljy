const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-2' });
const s3 = new AWS.S3();

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
    await page.type('#comp-jun9fokpinput', 'AWS TEST, written ' + new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}), {delay: 100});
    // email body text area
    await page.type('#comp-jun9gw2xtextarea', 'This is a test email sent programatically by Puppeteer and AWS.', {delay: 100});
  
    // send message
    await page.click('#comp-jun9fokslink', {delay: 100});

    await page.screenshot().then(async () => await getUploadURL());
    console.log('form submitted')

    return await browser.close();
}

const getUploadURL = async (res) => {
    const k = `${new Date().toISOString()}.png`;
    console.log('res', res)
    const s3Params = {
      Body: res,
      Bucket: 'big-node-modules',
      Key:  k,
      ServerSideEncryption: "AES256", 
      StorageClass: "STANDARD_IA"
    }

    return s3.putObject(s3Params, (e, data) => {
        if (e) console.log('error uploading object', e);
        else console.log('putObject cb data', data)
    })
    // return new Promise((resolve, reject) => {
    //   let uploadURL = s3.getSignedUrl('putObject', s3Params);
    //   resolve({
    //     "statusCode": 200,
    //     "isBase64Encoded": false,
    //     "headers": { "Access-Control-Allow-Origin": "*" },
    //     "body": JSON.stringify({
    //       "uploadURL": uploadURL,
    //       "photoFilename": k
    //     })
    //   })
    // });
  }

exports.handler = async () => doTheThing();