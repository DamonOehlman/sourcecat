# sourcecat

A simple tool for concatenating source files in a repository in some kind
of logical fashion.  Files are concatenated in alphabetical order (with
the exception of `index.js` trumping other files in a folder) breadth
first through the folder structure.

[
![NPM]
(https://nodei.co/npm/sourcecat.png)
](https://nodei.co/npm/sourcecat/)

[
![Build Status]
(https://drone.io/bitbucket.org/DamonOehlman/sourcecat/status.png)
](https://drone.io/bitbucket.org/DamonOehlman/sourcecat/latest)

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
