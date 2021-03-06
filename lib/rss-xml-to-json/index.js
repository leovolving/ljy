const {Parser} = require('xml2js');
const request = require('request-promise-native');
const parser = new Parser();

const getRssConvertXmlToJson = async (url, callback) => 
  request(url).then(feed => parser.parseStringPromise(feed).then(callback).catch(e => console.error('error parsing XML', e)));

module.exports = {getRssConvertXmlToJson};
