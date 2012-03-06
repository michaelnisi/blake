# Blake

#### [Blake](http://michaelnisi.github.com/blake/) is a small Node.js module, which provides a simple infrastructure to generate static websites. Blake is blog aware and view agnostic. It makes very little assumptions and stays out of the way. Blake leaves the actual implementation of the transformation from input data to output artifact to its user. 

Blake can be used from the command-line or as library.

### Install
	npm install -g blake

### Usage
	blake path/to/input path/to/output [path/to/input/file …]

The first parameter is the path to your input directory.

The second parameter is the path to your output directory. *Please be warned that this directory is removed everytime a full generation of your site starts.* You better not point it at your home directory—Blake doesn't provide safety net. If the output directory doesn't exist, Blake makes it.

	blake input output

The optional third parameter is a list of filenames. While writing, you often times just want to quickly preview the page you're currently working on, thus you don't necessarily want to render your whole site. Let's say you're tweaking your about page and want to see it in the browser.

	blake input output input/about.md

Or you may just want to compile your home and archive pages.

	blake input output input/home.md input/archive.md

#### Process
When Blake starts it requires a configuration module, which it expects to find at input/view/config.js. The configuration defines the conventions for accessing input data and exports a map of bake functions. In my opinion it makes sense to use template names as identifiers. Each of your views has to implement a bake function.

	# This module covers configuration.

	# Path conventions to use for input data.
	exports.paths =
	  data: '/data',
	  templates: '/templates/',
	  resources: '/resources/',
	  posts: '/data/posts'

	# Export map with bake functions by template names.
	exports.bakeFunctions =
  	  'rss.jade': require('./rss.js').bake,
     'article.jade': require('./article.js').bake,
     'home.jade': require('./home.js').bake,
     'about.jade': require('./about.js').bake,
     'archive.jade': require('./archive.js').bake

#### Deployment
Of course you can always build your site locally and upload it to your webserver manually, but I recommend to run Blake on your server and use [post-receive hooks](http://help.github.com/post-receive-hooks/) to automatically generate your site on your server everytime you're pushing to your input data repository.

#### License
See LICENSE.



