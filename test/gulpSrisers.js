var path = require('path');
var through2 = require('through2');
var gulp = require('gulp');
var sriResources = require('../index');
var fixsturesPath = path.join(__dirname, 'fixtures');

function checkResult(cb) {
  var files = {};

  return through2.obj(function(file, enc, callback) {
    var filePath = path.relative(file.base, file.path);
    files[filePath] = file.contents.toString();
    callback(null, file);
  }).on('finish', function() {
    cb(files);
  });
}

describe('Srizer', function() {
  it('Should add sris to css and js files', function(done) {
    console.log(__dirname);
    gulp.src('./fixtures/source/*.html')
        .pipe(sriResources())
        .pipe(gulp.dest('dist/blah')).on('end', done);
        // .pipe(checkResult(function(files) {
        //   console.log(files);
        //   done();
        // }));
  });
});
