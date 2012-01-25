// Methods to process input data.

var path = require('path');

// Marks the end of input data headers.
var END_MARKER = '$end';

var HTML = 'html';
var DOT = '.';

// Return formatted string for given date.
function formatDate (date) {
  return date.toDateString();
}

// Return new path object.
// config the configuration object
// inputPathName the path to the input directory
// outputPathName the path to the output directory
function getPaths (config, inputPathName, outputPathName) {
  inputPathName = inputPathName || '/';
  outputPathName = outputPathName || '/';

  return {
    outputPathName: outputPathName,
    pathToResources: path.join(inputPathName, config.paths.resources),
    pathToData: path.join(inputPathName, config.paths.data),
    templatesPathName: path.join(inputPathName, config.paths.templates),
    posts: path.join(inputPathName, config.paths.posts)
  };
}

// Return new source object.
function getSource (file, filename, paths) {
  var data, header, body;

  data = file.split(END_MARKER);
  header = JSON.parse(data[0] || null);
  body = data[1];

  if (!header) {
    throw(new Error('Header required.'));
  }

  if (!header.template) {
    throw(new Error('Template name required.'));
  }

  header.name = header.name || path.basename(filename).split(DOT)[0] + DOT + HTML;
  header.date = header.date ? new Date(header.date) : new Date();
  header.path = header.path || path.dirname(filename).split(paths.posts)[1];

  return {
    header: header,
    body: body,
    paths: paths,
    filename: filename,
    date: header.date,
    templatePath: path.join(paths.templatesPathName, header.template),
    path: path.join(paths.outputPathName, header.path),
    name: header.name,
    link: path.join(header.path, header.name.split(DOT)[0]),
    dateString: formatDate(header.date)
  };
}

module.exports = {
  getPaths: getPaths,
  getSource: getSource,
  formatDate: formatDate
};
