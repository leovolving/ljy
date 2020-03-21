const request = require('request-promise-native');
const {fullyEncodeURI} = require('../fully-encode-uri');

const postedTweets = [];

const oauth = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'TH81POLYHo0d0nZPvcivnmSAz',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'DgmdJUO70LUqyXf8csBibrKQDotbk5dQLvaE7gxgVZQcdLK7u6',
    token: process.env.TWITTER_ACCESS_TOKEN_KEY || '1184273012306014208-wOZVtewOizDjVGz2GJKFoEWN16eDnD',
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'evE39FEPWpSMcrFU1aK0WR4qXF5VzAb112vBna8DpVwVX'
  }

const postTweet = async status => {
    if (postedTweets.includes(status)) return;

    const url = 'https://api.twitter.com/1.1/statuses/update.json?status=' + fullyEncodeURI(status);

    return request({
        url,
        method: 'POST',
        json: true,
        oauth
    }).then(() => postedTweets.push(status)).catch(e => console.error('error with tweet', e.message));
}

const resetPostedTweets = () => {
    postedTweets.length = 0;
}

module.exports = {
    oauth,
    postedTweets,
    postTweet,
    resetPostedTweets
}
  