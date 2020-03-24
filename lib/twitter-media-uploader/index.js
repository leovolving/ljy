const fs = require('fs');
const request = require('request-promise-native');
const {oauth} = require('../twitter');
const {fullyEncodeURI} = require('../fully-encode-uri');

class TwitterMediaUploader {
    constructor() {
        this.mediaId = '1242544696133431296'
        this.mediaPath = null
        this.mediaSize = 0
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
        this.processFile = this.processFile.bind(this);
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
        this.mediaSize = fs.statSync(this.mediaPath).size;
        console.log('size', this.mediaSize)
        const url = `https://upload.twitter.com/1.1/media/upload.json`;

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'INIT',
                'media_type': type, // 'video/mp4, image/jpeg, image/gif
                'media_category': TwitterMediaUploader.getMediaCategory(type), // 'tweet_video', tweet_image
                'total_bytes': this.mediaSize
            }
        })
        .then((res) => {
            console.log('done init', res.media_id_string)
            this.mediaId = res.media_id_string;
        })
        .catch(e => console.error('TwitterMediaUploader: error with init', e.message));
    }

    async append(chunk, i=0) {
        console.log('start append')
        const url = `https://upload.twitter.com/1.1/media/upload.json`;
        console.log('chunk size', chunk.length)

        return request({
            ...this.baseOptions,
            url,
            form: {
                command: 'APPEND',
                'media_data': chunk.toString('base64'),
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
    // https://gist.github.com/shiawuen/1534477
    async processFile() {
        const file = fs.readFileSync(this.mediaPath);
        const size = this.mediaSize;
        const sliceSize = 500000;
        let start = 0;
        let count = 0;
      
        setTimeout(loop.bind(this), 1);
      
        async function loop() {
          let end = start + sliceSize;
          
          if (size - end < 0) {
            end = size;
          }
          console.log('end', end)
          
          const s = this.slice(file, start, end);
      
          await this.append(s, count);
          count++;
          console.log('end < size and typeof', end < size, typeof end, typeof size)
      
          if (end < size) {
            start += sliceSize;
            console.log('start', start)
            setTimeout(loop.bind(this), 1);
          }

          if (end === size) this.finalize();
        }
      }

      slice(file, start, end) {
        const slice = file.mozSlice ? mozSlice :
                    file.webkitSlice ? file.webkitSlice :
                    file.slice ? file.slice : noop;
        
        return slice.bind(file)(start, end);
      }
      
      noop() {}
}

const t = new TwitterMediaUploader();
const testTweet = async () => await t.tweet('Test image uploaded via Twitter API.');
t.init('https://media.giphy.com/media/gdeC0NMdWlm5VaLB5b/source.gif', 'image/gif')
    .then(t.processFile)
    .then(testTweet)
    .catch(e => console.error('shit broke', e))
// t.tweet('Test GIF from remote source')


// module.exports = {TwitterMediaUploader};