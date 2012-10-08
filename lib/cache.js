// cache

var LRU = require("lru-cache")
  , options = { max: 50
              , maxAge: 1000 * 60 * 60 }

module.exports = LRU(options)
