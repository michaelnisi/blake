{
  "title": "Homebrew",
  "description": "This unintrusive packet manager with a Git foundation evolved to de facto standard and is the easiest way to install UNIX tools on OS X.",
  "template": "article.jade",
  "date": "2011-10-10",
  "path": "2011/10"
}

THE FIRST MEETING of [The Homebrew Computer Club](http://en.wikipedia.org/wiki/Homebrew_Computer_Club) was held in March 1975 in Gordon French's garage in Menlo Park, San Mateo County, California. The objective of the Club was to maintain a regular, open forum for people to get together to work on making computers more accessible to everyone.

Wikipedia:
> The Homebrew Computer Club was an early computer hobbyist users' group in Silicon Valley, which met (under that name) from March 5, 1975 to December 1986. Several very high-profile hackers and IT entrepreneurs emerged from its ranks, including the founders of Apple Inc.

[Homebrew](http://mxcl.github.com/homebrew/) is a package manager created by [Max Howell](https://github.com/mxcl) to make UNIX tools more accessible to every OS X user. It's one of these simple applications that just work.

Basically Homebrew is a [Git](http://git-scm.com/) repository, cloned to `/usr/local` to avoid sudo during installation; it's self contained, doesn't alter the system, and may be [removed](https://gist.github.com/1173223) at any time.

Homebrew installs packages to `/usr/local/Cellar` and symlinks some of the installation into `/usr/local`. The packages are installed according to their formulas, which are plain Ruby classes, located in `/usr/local/Library/Formula`.

Driven by the community, with some 4.000 forks on [GitHub](https://github.com/mxcl/homebrew), the formulas seem to be self healing. The ease to contribute to Homebrew almost forces its users to contribute, resulting in frequently updated formulas. 

*To provide a simple usage example,* say, after we [installed](https://github.com/mxcl/homebrew/wiki/installation) Homebrew, we fancy to try [Erlang](http://smyck.net/2012/04/22/why-erlang/); we'd search Homebrew to check if there's a [formula](https://github.com/mxcl/homebrew/blob/master/Library/Formula/erlang.rb) to install it:

    % brew search erlang

And certainly there is—so we'd install Erlang:

    % brew install erlang

Done. Ready to run the Erlang shell:

    % erl
 
By now I consider Homebrew part of OS X and rely on it, in fact, I tend to abandon software installation entirely, when prompted for sudo. Homebrew isn't the missing packet manager, it's *the* packet manager for OS X. And yes; it runs this cute beer name theme with cellar, kegs and formulas—Cheers!
