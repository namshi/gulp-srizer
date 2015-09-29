
var gutil = require('gulp-util');
var fs = require('fs');
var should = require('should');
var sriResources = require('../index');

function loadFile(name) {
  return new gutil.File({
    path: 'test/expected/' + name,
    cwd: 'test/',
    base: 'test/expected/',
    contents: fs.readFileSync('test/expected/' + name)
  });
}

function processInput(opts, srcFile, expectedFileName, done) {
  var stream = sriResources(opts);

  stream.on('error', function(err) {
    should.not.exist(err);
    done(err);
  });

  stream.on('data', function(newFile) {
    should.exist(newFile);
    should.exist(newFile.contents);

    String(newFile.contents).should.equal(String(loadFile(expectedFileName).contents));
    done();
  });

  stream.write(srcFile);
  stream.end();
}

describe('Srizer', function() {
  it('Should add sris to css and js resources in html file', function(done) {

    var srcFile = new gutil.File({
      path: 'test/fixtures/source/index.html',
      cwd: 'test/',
      base: 'test/fixtures/source/',
      contents: fs.readFileSync('test/fixtures/source/index.html')
    });

    processInput({}, srcFile, 'css+js.html', done);
  });
});
