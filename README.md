# Blake
*Agnostic site bakery*

[Blake](http://michaelnisi.github.com/blake/) is a [Node.js](http://nodejs.org/) module that provides a simple, blog aware and view agnostic infrastructure to generate static websites. To offer unrestricted choice of input formats and template languages, Blake solely takes care of IO and template routing; it delegates the actual transformation from input data to output artifacts to user-written view modules. It can be used from command-line or as library. Site generation with Blake is asynchronous, which makes the process more effective by generating artifacts in parallel; it also enables us to do asynchronous tasks in the views, like pulling in data from other sources over the wire or from disk.

[![Build Status](https://secure.travis-ci.org/michaelnisi/blake.png)](http://travis-ci.org/michaelnisi/blake)

### Pronounciation
    /ˈbleɪk/ blayk

### Installation
Install via [npm](http://npmjs.org/):

    npm install -g blake

If you're not planning to use command-line blake, install without global flag:

    npm install blake

To install from source:

    git clone git://github.com/michaelnisi/blake.git 
    cd blake
    npm link

### Command-line Usage
    blake path/to/input path/to/output path/to/input/file …

The first parameter is the path to our input directory. The second parameter is the path to our output directory. 

    blake input output

Note that the output directory is not deleted, so its contents piles up. For clean output we have to delete the output directory before we generate our site. 

The optional third to n parameters are filenames, which can be used to generate specific files. While writing, we often times just want to quickly preview the page we're currently working on, thus we don't necessarily want to render our whole site. Let's say we're tweaking our about page.

    blake input output input/about.md

Or we may just want to compile our home and archive pages.

    blake input output input/home.md input/archive.md

### Usage as library
Generate complete site.

    var blake = require('blake');

    blake.bake('input', 'output', function(error) {
      // Site generated
    });


Generate a specific page.

    var blake = require('blake');
    var input = 'path/to/input';
    var output = 'path/to/output';
    var file = path.resolve(input, 'about.md');

    blake.bake(input, output, file, function(error) {
      // About page generated
    });


Generate multiple specific pages.

    var blake = require('blake');
    var input = 'path/to/input';
    var output = 'path/to/output';
    var fileA = path.resolve(input, 'home.md');
    var fileB = path.resolve(input, 'archive.md');

    blake.bake(input, output, fileA, fileB, function(err) {
      // Home and archive page generated
    });

### Overview
At the top of each input file in `input/data` Blake expects a JSON header. From the header and the content of the input file Blake constructs a source object, with which it applies the `bake` function of the according view module. This is done for all input files in parallel. The static resources in `input/resources` are copied to the output directory as they are.

### Configuration
When Blake starts to generate a site, it requires a configuration module, which it expects to find in `input/view/config.js`. The configuration defines the conventions for accessing input data and exports a map of bake functions with template names as identifiers.

    // This module covers configuration.

    // Export path conventions for input data.
    exports.paths = {
      data: 'data', // required
      templates: 'templates', // required
      resources: 'resources', // optional
      posts: 'data/posts' // optional
    };

    // Export map with bake functions by template names.
    exports.bakeFunctions = {
      'rss.jade': require('./rss.js').bake,
      'article.jade': require('./article.js').bake,
      'home.jade': require('./home.js').bake,
      'about.jade': require('./about.js').bake,
      'archive.jade': require('./archive.js').bake
    };

The configuration module is required to export a `paths` and a `bakeFunctions` object.

The `paths` object defines input paths, where the two required directories are `data` and `templates`. From `data` Blake loads general input data and from `templates` Blake loads templates. The two optional directories are `resources` and `posts`. The content of `resources` is copied to output as it is. The `posts` directory hosts our blog posts.

The `bakeFunctions` object is a map of functions.

### Input
Each input file has to begin with a JSON string. This string is interpreted as header, it's expected to provide transformation parameters; besides it can contain additional user defined data—a raw version of the header is passed to the `bake` methods of the views. The header is required. In some cases, a RSS feed for example, the input file may consist of only the header, not followed by any content, which is valid.

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21"
    }

    The content of the example article.

The end of the header is marked by an empty line. Everything that follows is interpreted as content, and is passed to the views, untouched by blake. Blake doesn't implement any text conversion.

### The Header
The header is a string in JSON at the top of each input file, separated from the content that follows by an empty line.

This is a skinny header.

    {
      "template": "article.jade"
    }

The `template` field is the only required field in the header. It's used to load the template and route it to the `bake` function, we define in `bakeFunctions` of the configuration (see above).

The optional header fields, interprated by Blake, are `title`, `description`, `date`, `path` and `name`.

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21",
      "path": "2012/03",
      "name": "example"
    }

The `date` field represents the publish date, if not provided it's set to now.

The `path` field is the output path, which, if not provided, is substituted by mirroring the path of the input file.

The `name` field is used as filename of the output file, if not set Blake applies the filename of the input file.

The header is extendable with arbritrary fields, which can be interpreted by the views. The source object, passed to the views, provides a reference to the header object.

If you decide to mirror input file path and name in your output, you can omit path and name. In that case a typical header of a blog post might look like the following.

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21",
    }

Just a header without content is valid input too. This is useful for aggregated input data like RSS feeds. Consider the following rss.json.

    {
      "title": "Mr Fancy Pants",
      "description": "Undescribably fancy pants",
      "link": "http://your.site/",
      "template": "rss.jade",
      "name": "rss.xml"
    }

### Views
The view modules are required to export a `bake` function with the following signature.

    bake(src, callback)

In this function you implement the transformation from input to output and pass the result to the callback.

The `src` object for a exemplary blog post exposes the following. For brevity the contents of `body` and `template` appear shortened here.

    header: { title: 'Closure',
              description: 'A function together with a referencing environment',
              template: 'article.jade',
              date: Tue, 18 Oct 2011 00:00:00 GMT,
              name: 'closures.html',
              path: '/2011/10' },
    body: '…',
    paths: { outputPathName: '../website',
             pathToResources: 'resources',
             pathToData: 'data',
             templatesPathName: 'templates',
             posts: 'data/posts',
             config: 'views/config.js' },
    filename: 'data/posts/2011/10/closures.md',
    date: Tue, 18 Oct 2011 00:00:00 GMT,
    templatePath: 'templates/article.jade',
    path: '../website/2011/10',
    name: 'closures.html',
    link: '/2011/10/closures',
    dateString: 'Tue Oct 18 2011',
    template: '…'

To see a simple example:
   
    git clone git://github.com/michaelnisi/blake.git 
    cd blake/example
    node generate.js

To evaluate a more elaborate example you could generate my personal [site](http://michaelnisi.com), which requires [Jade](http://jade-lang.com/) and [Markdown](http://daringfireball.net/projects/markdown/):

    npm install -g blake
    npm install blake jade markdown
    git clone git@github.com:michaelnisi/michaelnisi.git 
    blake michaelnisi /tmp/michaelnisi-site

You might want to read the [documentation](http://michaelnisi.github.com/michaelnisi/article.html) of the views for this site, which are written in [CoffeeScript](http://coffeescript.org/); not to put you off, just to give it a shot, as I found the use case fitting.

### Deployment
Of course you can build your site locally and upload it to your webserver manually, but I recommend to run Blake on your server, and use [post-receive hooks](http://help.github.com/post-receive-hooks/) to automatically generate your site on your server everytime you push to your input data repository.

### Website
A rudimentary [website](http://michaelnisi.github.com/blake/).

### Documentation
See [Documentation](http://michaelnisi.github.com/blake/blake.html)

### License
See [LICENSE](https://raw.github.com/michaelnisi/blake/master/LICENSE).
