var sourcecat = require('../');
var path = require('path');
var testPath = path.dirname(__dirname);
var test = require('tape');

test('load files', function(t) {
  t.plan(3);

  sourcecat.load('', { cwd: testPath }, function(err, files) {
    t.ifError(err);
    t.ok(Array.isArray(files), 'have files');
    t.equal(files.length, 1, 'got one file');
  });
});