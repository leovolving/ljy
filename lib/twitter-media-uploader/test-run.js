const { TwitterMediaUploader } = require(".");

const t = new TwitterMediaUploader();
t.init([
  {
    path: "https://i.picsum.photos/id/991/300/300.jpg",
    type: "image/jpg"
  },
  {
    path: (__dirname + "/test.1.jpg"),
    type: "image/jpg"
  },
  {
    path: (__dirname + "/test.2.jpg"),
    type: "image/jpg"
  },
  {
    path: (__dirname + "/test.3.jpg"),
    type: "image/jpg"
  },
])
  .then(t.processFile)
  .then(() => t.tweet("test media"))
  .catch(e => console.error("something broke", e));


  // t.tweet('testing old mediaId')
