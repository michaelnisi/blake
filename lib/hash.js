// hash - get md5 hash for string

var createHash = require('crypto').createHash

module.exports = function (str) {
  return createHash('md5').update(str).digest('hex')
}
