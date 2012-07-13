# blake - generate sites

## SYNOPSIS

    blake source_directory target_directory  
    blake source_directory target_directory source_file ...

## DESCRIPTION   

In the first synopsis form, blake writes all files generated from input data in the `source_directory` to the `target_directory`. In the second synopsis form, just the file generated from the `source_file` is written to the `target_directory`. You can also generate from multiple source files. 

Blake is a [Node.js](http://nodejs.org) module that provides a simple, blog aware, and view agnostic infrastructure to generate static websites. For unrestricted choice of input formats and template languages, blake confines itself to IO and template routing; it delegates the actual file generation to user-written generator functions. Blake is non-blocking; it can be used from command-line or as library.

[![Build Status](https://secure.travis-ci.org/michaelnisi/blake.png)](http://travis-ci.org/michaelnisi/blake)

## LIBRARY USAGE

Generate all files:

    var blake = require('blake')

    blake('source', 'target', function(err) {
      // Site generated
    })

Generate a specific file:

    var blake = require('blake')

    blake('source', 'target', 'source/about.md', function(err) {
      // About page generated
    })

Generate multiple specific files:

    var blake = require('blake')
      , source  = 'path/to/input'
      , target = 'path/to/output'
      , home = path.resolve(input, 'home.md')
      , archive = path.resolve(input, 'archive.md')

    blake(source, target, home, archive , function(err) {
      // Home and archive page generated
    })

## OVERVIEW

Blake requires a configuration module (config.js), which it expects to load from the root of the source directory; config has to export a paths object, and a map of generator functions. If no files are explicitly specifified, blake copies the static resoures to the target directory. After that each data source is piped through a stream, which generates and writes to the target directory.  

## CONFIGURATION

Consider the following configuration module:

    exports.paths = {
      data: 'data' // required
    , templates: 'templates' // required
    , resources: 'resources' // optional
    , posts: 'data/posts' // optional
    }

    exports.views = {
      'rss.jade': require('./rss.js').bake
    , 'article.jade': require('./article.js').bake
    , 'home.jade': require('./home.js').bake
    , 'about.jade': require('./about.js').bake
    , 'archive.jade': require('./archive.js').bake
    }

The `paths` object defines input paths, where the two required directories are `data` and `templates`. From `data` blake loads general input data; from `templates` templates. The two optional directories are `resources` and `posts`. The content of `resources` is copied to output as it is. The `posts` directory hosts blog posts.

The `views` object is a map of user-written functions which implement the actual generation of output artifacts. Theses functions are mapped by template name. 

## INPUT

At the top of each input file blake expects a JSON string that is interpreted as header and provides parameters for generating. Besides it can contain additional user defined data—a raw version of the header is passed to the `bake` methods of the views. The input data for a blog entry could look like the following: 

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21"
    }

    The content of the example article.

The end of the header is marked by an empty line. Everything that follows is interpreted as content and is passed to the views untouched.

## HEADER

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
* `template`is the filename of template to use (required)
* `date` is the publish date, if not provided it's set to `NOW` (optional)
* `path` is the output path, if not provided the path of the input file is used (optional)
* `name` is used as filename of the output file, if not provided the filename of the input file is used (optional)

The header is extendable with arbritrary fields, which can be interpreted by the views. The source object, passed to the views, provides a reference to the header object.

If you decide to mirror input file path and name in your output, you can omit path and name. In that case a typical header of a blog post might look like the following.

    {
      "title": "Example",
      "description": "An example article",
      "template": "article.jade",
      "date": "2012-03-21",
    }

An input file can consist of just the header; for example an RSS feed:

    {
      "title": "Blog",
      "description": "Just my blog.",
      "link": "http://my.blog",
      "template": "rss.jade",
      "name": "rss.xml"
    }

## VIEWS

Views must export a `bake` function with this signature:

    bake (item, callback)

In this function you implement the transformation from input to output and pass the result to the callback.

The `src` object for a exemplary blog post exposes the following (for brevity `body` and `template` appear shortened):

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

To evaluate a more elaborated example, you could generate my personal [site](http://michaelnisi.com), which requires [Jade](http://jade-lang.com/) and [Markdown](http://daringfireball.net/projects/markdown/):

    npm install -g blake
    npm install blake jade markdown
    git clone git@github.com:michaelnisi/michaelnisi.git 
    blake michaelnisi /tmp/michaelnisi-site
    node /tmp/michaelnisi-site/conf/dev.js

## DEPLOYMENT

Of course you can build your site locally and upload it to your webserver manually, but I recommend to run Blake on a server, and use [post-receive hooks](http://help.github.com/post-receive-hooks/) to automatically generate your site on the server everytime you push to your input data repository.

## INSTALLATION

Install via [npm](http://npmjs.org/):

    npm install -g blake

If you not want to use command-line blake, install without global flag:

    npm install blake

To install from source:

    git clone git://github.com/michaelnisi/blake.git 
    cd blake
    npm link

## SEE ALSO

* [Website](http://michaelnisi.github.com/blake/)
* [Documentation](http://michaelnisi.github.com/blake/blake.html)

## LICENSE

[MIT License](https://raw.github.com/michaelnisi/blake/master/LICENSE)
