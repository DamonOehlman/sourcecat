var sourcecat = require('../../');
var path = require('path');
var testName = path.basename(__filename, '.js');
var testPath = path.resolve(__dirname, testName);
var test = require('tape');

test(testName, function(t) {
  t.plan(1);
  
  sourcecat('', { cwd: testPath }, function(err, files) {
    t.ifError(err);
  });
});
