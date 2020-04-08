// https://gist.github.com/jsoverson/d69233f4fb09c4203cd7113017b3449b#file-reddit-signup-js
const puppeteer = require('puppeteer');
const request = require('request-promise-native');
const poll = require('promise-poller').default;

const siteDetails = {
  sitekey: '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
  pageurl: 'https://old.reddit.com/login'
}

const apiKey = process.env.CAPTCHA_API_KEY;

function logError(e) {
    console.error(e)
}

(async function main() {
  const browser = await puppeteer.launch({defaultViewport: {width: 1000, height: 800}});

  const page = await browser.newPage();

  await page.goto('https://old.reddit.com/login');

  const requestId = await initiateCaptchaRequest(apiKey);

  await page.type('#user_reg', 'joemcelroy0726', {delay: 100});

  const password = 'Sw0m3ad]sP2a1a$sy73w0frdY@l1!';
  await page.type('#passwd_reg', password, {delay: 100});
  await page.type('#passwd2_reg', password, {delay: 100});

  const response = await pollForRequestResults(apiKey, requestId);
  
  await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);

  await page.click('#register-form button[type=submit]');

  return page.screenshot({path: 'screenshots/test.reddit.png'})
})().catch(logError);

async function initiateCaptchaRequest(apiKey) {
  const formData = {
    method: 'userrecaptcha',
    googlekey: siteDetails.sitekey,
    key: apiKey,
    pageurl: siteDetails.pageurl,
    json: 1
  };
  const response = await request.post('http://2captcha.com/in.php', {form: formData}).catch(logError);
  const res = JSON.parse(response);
  console.log('initiateCaptchaRequest res', res)
  if (res.status === 0) throw new Error(res.request);
  return res.request;
}

async function pollForRequestResults(key, id, retries = 100, interval = 2500, delay = 15000) {
  await timeout(delay);
  return poll({
    taskFn: requestCaptchaResults(key, id),
    interval,
    retries
  }).catch(logError);
}

function requestCaptchaResults(apiKey, requestId) {
  const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
  return async function() {
    return new Promise(async function(resolve, reject){
      const rawResponse = await request.get(url).catch(logError);
      const res = JSON.parse(rawResponse);
      console.log('requestCaptchaResults res', res)
      if (res.status === 0) return reject(res.request);
      resolve(res.request);
    });
  }
}

const timeout = millis => new Promise(resolve => setTimeout(resolve, millis))