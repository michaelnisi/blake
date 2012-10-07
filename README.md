# blake - generate site

[![Build Status](https://secure.travis-ci.org/michaelnisi/blake.png)](http://travis-ci.org/michaelnisi/blake)

## Description

The blake node module provides a simple, blog aware infrastructure to generate static sites. For unrestricted choice of input formats and template languages, blake confines itself to IO and template routing; it delegates file generation to user-written functions.

## CLI Usage

    blake source_directory target_directory
    blake source_directory target_directory source_file ...

In the first synopsis form, blake writes all files generated from input data in the `source_directory` to the `target_directory`. In the second synopsis form, output is generated from the specified source files only.

## Library Usage

Generate from directory:

    var blake = require('blake')
      , source = 'blake-site'
      , target = '/tmp/blake-site'
      , join = require('path').join
      , Reader = require('fstream').Reader
      , props = { path:join(source, 'data') }
      , cop = require('cop')

    new Reader(props)
      .pipe(cop('path'))
      .pipe(blake(source, target))
      .pipe(cop(function (filename) { return filename + '\n' }))
      .pipe(process.stdout)

Copy static resources and generate from directory:

    var blake = require('blake')
      , source = 'blake-site'
      , target = '/tmp/blake-site'
      , join = require('path').join
      , Reader = require('fstream').Reader
      , props = { path:join(source, 'data') }
      , cop = require('cop')
      , copy = require('../lib/copy.js')

    copy(join(source, 'resources'), target)
      .on('error', function (err) {
        console.error(err)
      })
      .on('end', function () {
        new Reader(props)
          .pipe(cop('path'))
          .pipe(blake(source, target))
          .pipe(cop(function (filename) { return filename + '\n' }))
          .pipe(process.stdout)
      })

Generate from files:

    var blake = require('blake')
      , cop = require('cop')
      , readArray = require('event-stream').readArray
      , filenames = ['first/fil', 'second/file', 'third/file']
      , source = 'source_directory'
      , target = 'target_directory'
 
    readArray(filenames)
      .pipe(blake(source, target))
      .pipe(cop(function (filename) { return filename + '\n' }))
      .pipe(process.stdout)

## Events

The `blake` function returns a readable and writable [Stream](http://nodejs.org/api/stream.html) that emits following events:

### Event: 'data'

    function (path) { }

The `data` event emits paths of generated artifacts.

### Event: 'end'

    function () { }

Emitted when blake is done.

### Event: 'error'

    function (err) { }

Emitted if an error occured.

## Configuration

blake requires a configuration module (`source_directory/config.js´), which exports `paths`, and `views`, a map of generator functions:

    exports.paths = {
      data: 'data' 
    , templates: 'templates'
    , resources: 'resources'
    , posts: 'data/posts'
    }

    exports.views = {
      'rss.jade': require('./rss.js')
    , 'article.jade': require('./article.js')
    , 'home.jade': require('./home.js')
    , 'about.jade': require('./about.js')
    , 'archive.jade': require('./archive.js')
    }

The `paths` object defines input paths, with two required directories: `data` and `templates`. From `data` blake loads general input data, `templates` is the directory for templates. The two optional directories are `resources` and `posts`. The content of `resources` is copied to the `target_directory' unchanged. The `posts` directory hosts blog posts.

The `views` object is a map of user-written functions that implement the actual generation of output artifacts. Here, these functions are mapped by template name. 

## Input

At the top of each input file blake expects a JSON string that is interpreted as header providing transformation parameters. Besides it can contain additional user defined data—the `item` parameter, passed to the view functions, provides a reference to the raw header. Input data for a blog entry could look like so: 

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21"
    }

    The content of the example article.

The end of the header is marked by an empty line. Everything that follows is interpreted as content and is passed to the views untouched.

## Header

JSON at the top of an input file:

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21",
      "path": "2012/03",
      "name": "example"
    }

* `title` is the title of the page (optional)
* `description` is the description of the page or rather the post (optional)
* `template`is the filename of the template to use (required)
* `date` is the publish date, if not provided it's set to `NOW` (optional)
* `path` is the output path, if not provided the path of the input file is used (optional)
* `name` is used as filename of the output file, if not provided the filename of the input file is used (optional)

The source object, passed to the views, provides a reference to the raw header object. Thus, the header is extendable with arbritrary fields, which can be interpreted by the generators (written by you).

If you decide to mirror the input paths in your output, you can omit path and name. In that case a typical header of a blog post might look like the following:

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21",
    }

Input data with this header, located at 'source_directory/data/posts/2012/03/example.md`, would produce `2012/03/article.html`.

An input file can consist of just a header (without content) to generate, for example, an RSS feed.

    {
      "title": "Blog",
      "description": "Stuff I write",
      "link": "http://my.blog",
      "template": "rss.jade",
      "name": "rss.xml"
    }

## Views

The views—alternative naming would be: transformers, generators, or bakers—are the functions that generate your artifacts; they have the following signature:

    function (item, callback)

The passed in 'item' provides the input data to generate the artifact (or most likely the page).

Here, for example, an `item` representing a blog post:

    { header: 
      { title: 'Static Websites',
        description: '...',
        template: 'article.jade',
        data: Thu May 17 2012 02:00:00 GMT +0200 (CEST),
        path: '2012/05',
        name: 'static-websites.html' }
      body: '...', 
      paths: 
      { target: '/tmp/michaelnisi-site',
        resources: '/Users/michael/workspace/michaelnisi/resources',
        data: '/Users/michael/workspace/michaelnisi/data',
        templates: '/Users/michael/workspace/michaelnisi/templates',
      posts: '/Users/michael/workspace/michaelnisi/data/posts' },
      title: 'Static Websites',
      name: 'static-websites.html',
      date: Thu May 17 2012 02:00:00 GMT+0200 (CEST),
      templatePath: '/Users/michael/workspace/michaelnisi/templates/article.jade',
      path: '/tmp/michaelnisi-site/2012/05/static-websites.html',
      link: '2012/05/static-websites',
      dateString: 'Thu May 17 2012',
      bake: [Function],
      template: <Buffer 0a 20 20 20 20 64 69 76 ...> }

To see a simple example:

    git clone git://github.com/michaelnisi/blake.git 
    cd blake/example
    node generate.js
    open /tmp/blake-site/index.html

To evaluate a more elaborate example, you might generate my [blog](http://michaelnisi.com), for which I use [Jade](http://jade-lang.com/) and [Markdown](http://daringfireball.net/projects/markdown/):

    npm install -g blake
    npm install blake jade markdown
    git clone git://github.com/michaelnisi/troubled.git
    blake troubled /tmp/troubled-site
    
## Deployment

Of course you can build your site locally, and upload it to your webserver manually; but I recommend to run blake on a server, using [post-receive hooks](http://help.github.com/post-receive-hooks/) to automatically generate your site, post to each push your input data repository receives.

## Installation

Install with [npm](http://npmjs.org/):

    npm install blake

To `blake` from the command-line:

    npm install -g blake

## License

[MIT License](https://raw.github.com/michaelnisi/blake/master/LICENSE)
