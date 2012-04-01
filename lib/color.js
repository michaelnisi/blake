// Nice colors.

// Return red string.
var red = function(str) {
  return colorize(str, 31);
};

// Return green string.
var green = function(str) {
  return colorize(str, 32);
}

var colorize = function(str, c) {
  return '\u001b[' + c + 'm' + str + '\u001b[39m';
}

// Export API.
module.exports = {
  red: red,
  green: green
}
