var fs = require('fs');
var path = require('path');
var sourcecat = require('../../');

module.exports = function(t) {
  var testPath = path.resolve(__dirname, '..', 'fixtures', t.name);
  var sourceFiles;
  var expected;

  t.test('load files', function(t2) {
    t2.plan(3);

    sourcecat.load('', { cwd: testPath }, function(err, files) {
      t2.ifError(err);
      t2.ok(Array.isArray(files), 'have files');
      t2.equal(files.length, 3);

      sourceFiles = files;
    });
  });

  t.test('load reference combined', function(t2) {
    t2.plan(1);

    fs.readFile(path.join(testPath, 'expected.txt'), 'utf-8', function(err, data) {
      t2.ifError(err);
      expected = data;
    });
  });

  t.test('compare to expected output', function(t2) {
    t2.plan(2);

    sourcecat.combine(sourceFiles, function(err, output) {
      t2.ifError(err);
      t2.equal(output, expected, 'output === expected');
    });
  });
};