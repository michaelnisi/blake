# Blake
*Agnostic site bakery*

[Blake](http://michaelnisi.github.com/blake/) is a small [Node.js](http://nodejs.org/) module that provides a simple, blog aware and view agnostic infrastructure to generate static websites. It makes very little assumptions and stays out of the way. Blake delegates the actual transformation, from input data to output artifact, to views written by you. It can be used from command-line or as library.

### Pronounciation
    /ˈbleɪk/ blayk

### Installation
    npm install -g blake

### Usage
    blake path/to/input path/to/output path/to/input/file …

The first parameter is the path to your input directory.

The second parameter is the path to your output directory. Currently the output directory is not deleted, so its contents piles up. If you want to have a clean output you have to delete it manually before you generate your site.

    blake input output

The optional third to n parameters are filenames, which can be used to generate specific files. While writing, you often times just want to quickly preview the page you're currently working on, thus you don't necessarily want to render your whole site. Let's say you're tweaking your about page and want to see it rendered in the browser.

    blake input output input/about.md

Or you may just want to compile your home and archive pages.

    blake input output input/home.md input/archive.md

### Overview
Blake expects each file in input/data to begin with, or to be, a JSON String, which I call header. This header defines the parameters of the transformation from input to output. 

From the header and the content of the input file Blake constructs a source object, with which the bake function of the according view module is applied. This is done for all input files in parallel. The static resources are copied to the output directory. And that's it—site generated. Because you are implementing the bake functions of the views yourself, you are free to chose whatever markup and templating you like. Blake takes care of the routing.

### Configuration
When Blake starts it requires a configuration module, which it expects to find at:

    input/view/config.js

The configuration defines the conventions for accessing input data and exports a map of bake functions with a template name as identifier. Each of your views has to implement a bake function.

The following examples are written in CoffeeScript, which is not optimal for this README, I should provide examples in plain JavaScript. I hope you don't mind. OK, here is the config.coffee file of my site.

    # This module covers configuration.

    # Path conventions to use for input data.
    exports.paths =
      data: 'data',
      templates: 'templates',
      resources: 'resources',
      posts: 'data/posts'

    # Export map with bake functions by template names.
    exports.bakeFunctions =
      'rss.jade': require('./rss.js').bake,
      'article.jade': require('./article.js').bake,
      'home.jade': require('./home.js').bake,
      'about.jade': require('./about.js').bake,
      'archive.jade': require('./archive.js').bake

The configuration module expresses all assumptions Blake makes. The module exports two objects. In the *paths* object you see the four paths required in your input directory to generate a site with Blake. The data path contains the input data for your site and from templates Blake loads your templates. All files in resources are considered static files and are just copied over to your output directory as they are. The posts path is used by Blake to distinguish blog posts from other content. *bakeFunctions* is a map of bake functions by template identifiers. Blake assumes, templates and view modules are symmetric, and uses this map to route templates to views.

### Input
Each input file is expected to begin with a JSON string. This string is interpreted as header, it describes transformation parameters; it can contain additional user defined data—a raw version the resulting header object is passed to the bake methods of the views.

The end of the header is marked by an empty line (\n\n). Everything that follows is interpreted as content is passed to the views untouched by blake. 

### The Header
	{
	  "title": "Blake",
	  "description": "Agnostic site bakery",
	  "template": "article.jade",
	  "date": "2012-02-27",
	  "path": "2012/02"
	}

### Views
…

### Deployment
Of course you can always build your site locally and upload it to your webserver manually, but I recommend to run Blake on your server and use [post-receive hooks](http://help.github.com/post-receive-hooks/) to automatically generate your site on your server everytime you're pushing to your input data repository.

### License
See [LICENSE](https://raw.github.com/michaelnisi/blake/master/LICENSE).




