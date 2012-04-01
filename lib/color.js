// Nice colors.

// Color string.
var color = function(str, c) {
  return '\u001b[' + c + 'm' + str + '\u001b[39m';
};

// Return red string.
var red = function(str) {
  return color(str, 31);
};

// Return green string.
var green = function(str) {
  return color(str, 32);
};

// Export API.
module.exports = {
  red: red,
  green: green
};
