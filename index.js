/* jshint node: true */
'use strict';

/**
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

  ## Reference
**/

var fs = require('fs');
var async = require('async');
var glob = require('glob');
var reFiltered = /^(node_modules|test)\//i;
var reIndex = /index\.js$/;

/**
  ### sourcecat.generate(pattern, callback)

  From the current working directory, load the files matching the specified
  pattern and send the resulting data to the callback as an array of data
  objects (with a filename and content attribute).
**/
exports.generate = function(pattern, opts, callback) {
  // handle no specific callback
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }

  // glob it up
  glob(pattern || '**/*.js', opts, function(err, files) {
    if (err) {
      return callback(err);
    }

    // filter out files we don't want
    files = files.filter(function(filename) {
      return ! reFiltered.test(filename);
    });

    // sort the files
    files = files.sort(opts.sort || sortByFileDepthAndName);

    // read each of the files
    async.map(files, fs.readFile, function(err, results) {
      callback(err, (results || []).map(function(content, index) {
        return {
          filename: files[index],
          content: content
        };
      }));
    });
  });
};

/* internals */

function sortByFileDepthAndName(a, b) {
  var aParts = a.split('/');
  var bParts = b.split('/');
  var cmp = aParts.length - bParts.length;

  // if the comparison is not equal, then return that
  if (cmp !== 0) {
    return cmp;
  }

  // check for index.js
  if (reIndex.test(aParts[aParts.length - 1])) {
    return -1;
  }

  if (reIndex.test(bParts[bParts.length - 1])) {
    return 1;
  }

  return a.localeCompare(b);
}