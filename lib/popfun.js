// popfun - pop last item of array if it is a function

module.exports = popfun

function popfun (args) {
  if (!args || !args.length) return null

  var last = args[args.length - 1]
    
  if (typeof last === 'function') {
    return args.pop()
  }

  return null
}
