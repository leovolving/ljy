// encodes all characters encoded with encodeURIComponent, plus: ! ~ * ' ( )
const fullyEncodeURI = value => encodeURIComponent(value)
  .replace(/!/g, '%21')
  .replace(/'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/\*/g, '%2a')
  .replace(/~/g, '%7e');

module.exports = {fullyEncodeURI};
