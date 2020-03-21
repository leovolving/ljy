const fs = require('fs');
const request = require('request-promise-native');
const {oauth} = require('../twitter');
const {fullyEncodeURI} = require('../fully-encode-uri');

class TwitterMediaUploader {
    constructor() {
        this.mediaId = '1241189391155884032'
        this.mediaPath = null
        this.mediaCategories = ['TweetImage', 'TweetVideo', 'TweetGif', 'DmImage', 'DmVideo', 'DmGif', 'Subtitles'];
        this.baseOptions = {
            method: 'POST',
            json: true,
            oauth,
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        this.init = this.init.bind(this);
        this.append = this.append.bind(this);
        this.finalize = this.finalize.bind(this);
        this.tweet = this.tweet.bind(this);
    }

    static getMediaCategory(type) {
        switch(type) {
            case 'video/mp4':
                return 'tweet_video';
            case 'image/gif':
                return 'tweet_gif';
            default:
                return 'tweet_image';
        }
    }

    async init(path, type) {
        console.log('start init')
        this.mediaPath = path
        const size = fs.statSync(this.mediaPath).size;
        const url = `https://upload.twitter.com/1.1/media/upload.json`;

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'INIT',
                'media_type': type, // 'video/mp4, image/jpeg, image/gif
                'media_category': TwitterMediaUploader.getMediaCategory(type), // 'tweet_video', tweet_image
                'total_bytes': size
            }
        })
        .then((res) => {
            console.log('done init')
            this.mediaId = res.media_id_string;
        })
        .catch(e => console.error('TwitterMediaUploader: error with init', e.message));
    }

    // TODO: Chunk media
    async append(i=0) {
        console.log('start append')
        const media = fs.readFileSync(this.mediaPath);
        const url = `https://upload.twitter.com/1.1/media/upload.json`;

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'APPEND',
                'media_data': media.toString('base64'),
                'media_id': this.mediaId,
                'segment_index': i,
            }
        })
        .then(() => console.log('done append'))
        .catch(e => console.error('TwitterMediaUploader: error with append segment ' + i, e.message));
    }

    async finalize() {
        console.log('start finalize')
        const url = `https://upload.twitter.com/1.1/media/upload.json`;

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'FINALIZE',
                'media_id': this.mediaId
            }
        })
        .then(() => console.log('done finalize'))
        .catch(e => console.error('TwitterMediaUploader: error with finalizing', e.message));
    }

    async tweet(status) {
        const url = 'https://api.twitter.com/1.1/statuses/update.json?status='
        + fullyEncodeURI(status)
        + '&media_ids=' + this.mediaId;

        return request({
            url,
            method: 'POST',
            json: true,
            oauth
        }).catch(e => console.error('TwitterMediaUploader: error with tweet', e.message));
    }
}

const t = new TwitterMediaUploader();
const testTweet = async () => await t.tweet('Test image uploaded via Twitter API.');
t.init(__dirname + '/test.png', 'image/png')
    .then(t.append)
    .then(t.finalize)
    .then(testTweet)
    .catch(e => console.error('shit broke', e))


// module.exports = {TwitterMediaUploader};