# blake - generate anything

The **blake** [Node](https://nodejs.org/) package provides a file generation pipeline. I wrote it to generate my [site](http://troubled.pro/). Separating IO from data transformation—by using an intermediate representation—**blake** takes care of IO, and lets you get on with generating your stuff. Of course, [gulp](http://gulpjs.com/) puts itself forward as a streaming build system, but if you—like me—experience slight framework fatigue, and prefer plain Node, you might want to give **blake** a shot.

[![Build Status](https://travis-ci.org/michaelnisi/blake.png)](http://travis-ci.org/michaelnisi/blake)

## Example

Alas, I don't have a silly example yet, however, you can generate my site to get an understanding of how to use **blake**:

```
git clone https://github.com/michaelnisi/troubled.git
cd troubled
npm install
blake /tmp/troubled
```

Start an HTTP server in the target directory:

```
cd /tmp/troubled
python -m SimpleHTTPServer 8081
```

Point your browser to `http://localhost:8081` to inspect the result.

## CLI

```
blake [source_directory] target_directory [source_file ...]
```

If you skip passing the source directory, and give the target only, like in the example, **blake** will use the current working directory as source.

To generate specific files exclusively, you can pass arbitary source file paths.

## Types

### str()

Optional String type, which can be `String()`, `null`, or `undefined`.

### err()

Optional error type: `Error()`, `null`, or `undefined`.

### paths()

An object to configure paths.

- `resources` `str()` An optional path for static resources.
- `data` `String()` The path to the content directory.
- `templates` `String()` The folder to load templates from.
- `posts` `str()` An optional posts directory for bloglike sites.
- `target` `String()` The target directory.

### header()

Just a bag of things, passed to your **view function**, you can put anything you want in here; just remember that **blake** uses these properties internally:

- `template` `String()` The filename of the template.
- `title` `str()` The title of the item or `null`.
- `date` `str()` This optional date overrides the current date.
- `path` `str()` If this optional target path is not provided, **blake** will mirror the path of the source file.
- `name` `str()` A target filename to override the default source filename.

### item()

The item object, an intermediate representation of each file to generate, forms the core of **blake**; it is constructed internally and passed to the **view function**, in which you use its properties to produce the final output.

- `header` `header()` The original header.
- `paths` `paths()` The paths object populated by **blake**.
- `body` `str()` Everything after the header in the source file.
- `title` `str()` The title of the item.
- `name` `String()` The target file name.
- `date` `Date()` The current date or the date set in `header()`.
- `templatePath` `String()` The absolute path to the template file.
- `path` The absolute target file path.
- `link` The relative target file path applicable as local link on the site.
- `template` `Buffer()` The template data.
- `read` `read()`

`read(path, cb)`

Reads all source files in the given path recursively to apply the callback with an optional error and the resulting items—handy to create archives, feeds, etc.

- `path` `String()`
- `cb` `Function(er, items)`
  - `er` `err()` An optional Error.
  - `items` `[item()]` The resulting items.

### views()

An object that maps **view functions** by template filename.

## API

The **blake** module exports the constructor of the `Blake` Transform stream. To use it do `require('blake')`. A `Blake` stream has two additional getters providing access to parts of the configuration:

- `resources` `str()` The optional path to the resources directory.
- `data` `String()` The path to the data source directory.

This constructor—the solely exported function by the module—is decorated with two stateless functions, given `var blake = require('blake')`:

`blake.files(path)`

Returns a readable stream of all filenames in the given directory. The filenames are read recursively, directory names are skipped.

- `path` `String()` The path of the directory to read.

`blake.copy(source, target)`

Recursively copies all files from the `source` directory to the `target` directory; returns a readable stream of the copied target filenames.

- `source` `String()` The source directory.
- `target` `String()` The target directory.

### Configuring a site

The source directory has to contain a source module, which has to export `paths()` and `views()`:

```js
exports.paths = {
  data: 'data',
  templates: 'templates',
  resources: 'resources',
  posts: 'data/posts'
}

// Associate your view functions with template names.
exports.views = {
  'rss.jade': rss,
  'article.jade': article,
  'home.jade': home,
  'about.jade': about,
  'error.jade': about,
  'archive.jade': archive,
  'likes.jade': likes,
  'tweet.jade': tweet
}
```

### Writing a view

`view (item, cb)`

- `item` `item()`
- `cb` `Function(error, result)`
  - `error` `err()` Pass an error if something went wrong.
  - `result` `Buffer()` The resulting artifact generated by this view.

Each `item()` is associated with a **view function** by a template name in the configuration. This function—implemented by you—is responsible to generate the artifact. It is in this function where the actual work is done. Here you use values from the item and your template, also provided via the item, to generate the final output, which you apply to the callback once you are done—so it can be written to disk by **blake**.

### Creating a new instance

`blake(source, target)`

- `source` `str()` The source directory.
- `target` `String()` The target directory.

```js
var blake = require('blake')
var b = blake('./test/data', '/tmp/blake-example')
```

### Copying static resources

`blake.copy(resources, target)`

- `resources` `String()` A directory containing static resources.
- `target` `String()` The target directory.

``` js
var b = blake(source, target)
blake.copy(b.resources, target)
```

### Generating a site

For a complete build, you would typically generate the site after copying static resources:

```js
var b = blake(source, target)
blake.copy(b.resources, target).on('end', function () {
  blake.files(b.data).pipe(b)
}).resume()
```

### Generating specific files

Since **blake** is a Transform stream, you can easily generate only specific files:

```
var b = blake(source, target)
b.end('path/to/a/file')
```

## Install

With [npm](https://npmjs.org/package/blake) do:

```
npm install blake
```

To use the command-line interface:

```
npm install -g blake
```

## License

[MIT License](https://raw.github.com/michaelnisi/blake/master/LICENSE)
