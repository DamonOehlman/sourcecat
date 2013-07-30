# sourcecat

A simple tool for concatenating source files in a repository in some kind
of logical fashion.  Files are concatenated in alphabetical order (with
the exception of `index.js` trumping other files in a folder) breadth
first through the folder structure.

## Installation 

```
npm install sourcecat -g
```

## Usage

Specify the glob pattern as the first arg, that's all you can do. If none is
specified, then code me will look to find all of the `.js` files from your
current working directory down, excluding a few directories along the way
(node_modules, test).

## Special Cases

In the following cases, the behaviour of the `sourcecat` command changes:

- a `src/` folder is detected in the current working directory.  In this
  case, the top-level directory is skipped and only the `src/` directory
  is traversed.

## Reference

### sourcecat.generate(pattern, callback)

From the current working directory, load the files matching the specified
pattern and send the resulting data to the callback as an array of data
objects (with a filename and content attribute).
