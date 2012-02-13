// Methods to process input data.

// Require external dependencies.
var path = require('path');

// Marks the end of input data headers.
var END_MARKER = '$end';

// Some strings.
var HTML   = 'html';
var XML    = 'xml';
var RSS    = 'rss';
var ATOM   = 'atom';
var DOT    = '.';
var SLASH  = '/';

// The name of the directory where the views are located on the input path.
var VIEWS  = 'views';

// The filename of the configuration file.
var CONFIG = 'config.js'

// Return formatted string for given date.
var formatDate = function(date) {
  return date.toDateString();
}

// Return new path object.
// config the configuration object
// inputPathName the path to the input directory
// outputPathName the path to the output directory
var getPaths = function(config, inputPathName, outputPathName) {
  inputPathName = inputPathName || SLASH;
  outputPathName = outputPathName || SLASH;

  return {
    outputPathName: outputPathName,
    pathToResources: path.join(inputPathName, config.paths.resources),
    pathToData: path.join(inputPathName, config.paths.data),
    templatesPathName: path.join(inputPathName, config.paths.templates),
    posts: path.join(inputPathName, config.paths.posts),
    config: path.join(inputPathName, VIEWS, CONFIG)
  };
}

// Split the input data into header and body and validate the header. Header
// and a template property on the header are required. Set default properties
// for name, date and path on the header object. The default name is derived 
// from the filename of the input file ('article.*' to 'article.html', 'rss.*' 
// to 'rss.xml' and 'atom.*' to 'atom.xml'). Return the source object.
var getSource = function(file, filename, paths) {
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

  if (!header.name) {
    var name, extension;

    name = path.basename(filename).split(DOT)[0];
    extension = name === ATOM || name === RSS ? XML : HTML;

    header.name = name + DOT + extension;
  }

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

// Export API.
module.exports = {
  getPaths: getPaths,
  getSource: getSource,
  formatDate: formatDate
};
