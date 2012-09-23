// popfun - pop last item of array if it's a function

module.exports = popfun

function popfun (args) {
  if (!args) return null

  var last = args[args.length - 1]
    
  if (typeof last === 'function') {
    return args.pop()
  }

  return null
}
