const {TwitterMediaUploader} = require('.');

const t = new TwitterMediaUploader();
t.init('https://media.giphy.com/media/eIxyYuTr3JO9fe8VnV/source.gif', 'image/gif')
    .then(t.append)
    .then(() => t.tweet('test media'))
    .catch(e => console.error('something broke', e));
