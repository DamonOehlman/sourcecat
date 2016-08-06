
# sourcecat

A simple tool for concatenating source files in a repository in some kind
of logical fashion.  Files are concatenated in alphabetical order (with
the exception of `index.js` trumping other files in a folder) breadth
first through the folder structure.

[
![Build Status]
(https://travis-ci.org/DamonOehlman/sourcecat.svg?branch=damon-upgrade-deps)
](https://travis-ci.org/DamonOehlman/sourcecat)

[
![NPM]
(https://nodei.co/npm/sourcecat.png)
](https://nodei.co/npm/sourcecat/)

## Usage

Specify the glob pattern as the first arg, that's all you can do. If none is
specified, then code me will look to find all of the `.js` files from your
current working directory down, excluding a few directories along the way
(node_modules, test).

## Why SourceCat?

Because I like using [emu](https://github.com/puffnfresh/emu.js) for
generating my documentation, and using `sourcecat` I can put things in a
mostly sensible order:

```
sourcecat | emu > README.md
```

## Special Cases

In the following cases, the behaviour of the `sourcecat` command changes:

- a `src/` folder is detected in the current working directory.  In this
  case, the top-level directory is skipped and only the `src/` directory
  is traversed.

## Tips and Tricks

You can import a file in the sourcecat tree at a custom location by using
an `@import` line, e.g:

An example of this can be found in the
[tests](https://bitbucket.org/DamonOehlman/sourcecat/src/master/test/fixtures/custom-order/index.js?at=master#cl-6).

## Reference

### sourcecat.combine(files, callback)

Combine the input files (as read from the `sourcecat.load` function) into
a single output file.

### sourcecat.load(pattern, callback)

From the current working directory, load the files matching the specified
pattern and send the resulting data to the callback as an array of data
objects (with a filename and content attribute).
## License(s)

### MIT

Copyright (c) 2014-2016 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
