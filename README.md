# Blake
*Agnostic site bakery*

[Blake](http://michaelnisi.github.com/blake/) is a small [Node.js](http://nodejs.org/) module that provides a simple, blog aware and view agnostic infrastructure to generate static websites. It makes very little assumptions and stays out of the way. To offer unrestricted choice of input formats and template languages Blake delegates the actual transformation, from input data to output artifact, to views written by you. It can be used from command-line or as library.

### Pronounciation
    /ˈbleɪk/ blayk

### Installation
    npm install -g blake

If you're not planning to use Blake from the command-line it is recommended to install without global flag.

    npm install blake

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

The configuration module expresses all assumptions Blake makes. The module exports two objects. In the `paths` object you see the four paths required in your input directory to generate a site with Blake. The data path contains the input data for your site and from templates Blake loads your templates. All files in resources are considered static files and are just copied over to your output directory as they are. The posts path is used by Blake to distinguish blog posts from other content. `bakeFunctions` is a map of bake functions by template identifiers. Blake assumes that templates and view modules are symmetric, and uses this map to route templates to views.

### Input
Each input file is expected to begin with a JSON string. This string is interpreted as header, it's expected to provide transformation parameters; besides it can contain additional user defined data—a raw version of the resulting header object is passed to the bake methods of the views. The header is required. In some cases, a RSS feed for example, the input file may consist of just the header, not followed by any content, which is valid.

	{
	  "title": "Example",
	  "description": "An example article",
	  "template": "article.jade",
	  "date": "2012-03-21"
	}

    The content of the example article. I personally write in `markdown` and use jade templates.

The end of the header is marked by an empty line. Everything that follows is interpreted as content, and is passed to the views, untouched by blake. Blake doesn't implement any text conversion.

### The Header
The header is a string in JSON at the top of each input file, separated from the content that follows by an empty line.

This is the skimpiest header.
 
	{
	  "template": "article.jade",
	}

The `template` field is the sole required field in the header. It's used to load the template and route it to the bake function, user defined in `bakeFunctions` of the configuration (see above).

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

The `src` object for a exemplary blog post exposes the following.

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

To get a better idea on how to implement views you might want to have a look at the [views](http://michaelnisi.github.com/michaelnisi/article.html) of my [site](https://github.com/michaelnisi/michaelnisi), which are written in [CoffeeScript](http://coffeescript.org/) and use [Markdown](http://daringfireball.net/projects/markdown/) and [Jade](http://jade-lang.com/).

To see Blake in action you could generate my site.

	npm install -g blake
	npm install blake jade markdown
	git clone git@github.com:michaelnisi/michaelnisi.git 
	blake michaelnisi output
	
### Deployment
Of course you can always build your site locally and upload it to your webserver manually, but I recommend to run Blake on your server and use [post-receive hooks](http://help.github.com/post-receive-hooks/) to automatically generate your site on your server everytime you're pushing to your input data repository.

### Website
See [Website](http://michaelnisi.github.com/blake)

### Documentation
See [Documentation](http://michaelnisi.github.com/blake/blake.html)

### License
See [LICENSE](https://raw.github.com/michaelnisi/blake/master/LICENSE).

