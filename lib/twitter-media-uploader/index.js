const {oauth} = require('../twitter');

class TwitterMediaUploader {
    constructor() {
        this.mediaId = null
    }
    static mediaCategories = ['TweetImage', 'TweetVideo', 'TweetGif', 'DmImage', 'DmVideo', 'DmGif', 'Subtitles'];

    init(size, type) {
        const url = `https://upload.twitter.com/1.1/media/upload.json?command=INIT&total_bytes=${size}&media_type=${type}`;

        return request({
            url,
            method: 'POST',
            json: true,
            oauth
        })
        .then((res) => {
            this.mediaId = res.data.media_id_string;
        })
        .catch(e => console.error('TwitterMediaUploader: error with init', e.message));
    }

    append(md, i=0) {
        const url = `https://upload.twitter.com/1.1/media/upload.json?command=APPEND&media_id=${this.mediaId}&segment_index=${i}&media_data=${md}`;

        return request({
            url,
            method: 'POST',
            json: true,
            oauth
        })
        .catch(e => console.error('TwitterMediaUploader: error with append segment ' + i, e.message));
    }

    finalize() {
        const url = `https://upload.twitter.com/1.1/media/upload.json?command=FINALIZE&media_id=${this.mediaId}`;

        return request({
            url,
            method: 'POST',
            json: true,
            oauth
        })
        .catch(e => console.error('TwitterMediaUploader: error with finalizing', e.message));
    }
}

module.exports = {TwitterMediaUploader};