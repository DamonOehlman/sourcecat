/* jshint node: true */
'use strict';

/**
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

**/

var fs = require('fs');
var path = require('path');
var async = require('async');
var glob = require('glob');

// regexes
var reFiltered = /^(node_modules|test|examples|dist)\//i;
var reIndex = /index\.js$/;
var reImport = /^(?:.*)\@import\s+([\w\/]+)(\.js)?(.*)$/;

/**
  ### sourcecat.combine(files, callback)

  Combine the input files (as read from the `sourcecat.load` function) into
  a single output file.

**/
exports.combine = function(files, callback) {
  var importedFiles = {};

  function importFile(filename) {
    var content = '';

    // find the required file
    var targetFile = files.filter(function(data) {
      return data.filename === filename;
    })[0];

    // if we have the target file, then mark as imported
    if (targetFile) {
      importedFiles[filename] = true;
      content = process(targetFile.content.toString('utf8'));
    }

    return content;
  }

  function process(content) {
    // look for import lines
    var lines = content.split('\n').map(function(line) {
      var match = reImport.exec(line);

      // if not a match, then return the line as is
      if (! match) {
        return line;
      }

      return importFile(match[1] + '.js');
    });

    return lines.join('\n');
  }

  var output = files.map(function(file) {
    // if the file is importer already, then return an empty string
    if (importedFiles[file.filename]) {
      return '';
    }

    return process(file.content.toString('utf8') + '\n');
  }).join('');

  callback(null, output);
};

/**
  ### sourcecat.load(pattern, callback)

  From the current working directory, load the files matching the specified
  pattern and send the resulting data to the callback as an array of data
  objects (with a filename and content attribute).

**/
exports.load = function(pattern, opts, callback) {
  var cwd;

  // handle no specific callback
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }

  // determine the cwd
  cwd = (opts || {}).cwd || process.cwd();

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

    // resolve the path names against the current working directory
    files = files.map(function(filename) {
      return path.resolve(cwd, filename);
    });

    // read each of the files
    async.map(files, fs.readFile, function(err, results) {
      callback(err, (results || []).map(function(content, index) {
        return {
          filename: path.relative(cwd, files[index]),
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
