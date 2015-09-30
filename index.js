'use strict';

var sri = require('node-sri');
var through2 = require('through2');
var gStream = require('glob-stream');
var pathLib = require('path');

function getSris(extensions, path, options, callback) {
  var sris = [];
  var src = pathLib.join(path, '**/*.' + extensions);

  gStream.create(src)
    .pipe(through2.obj(function(file, enc, cb) {
      var filePath = pathLib.relative(file.base, file.path);
      sri.hash({file: file.path, algo: options.algo, prefix: options.prefix}, function(error, hash) {
        if (error) {
          throw error;
        }

        sris.push({filePath: filePath, hash: hash});
        cb(null, file);
      });
    }))
    .on('finish', function() {
      callback(null, sris);
    })
    .on('error', function(error) {
      callback(error);
    });
}

function getNewTagString(mstring, hash) {
  var sriArguments = ['integrity="' + hash + '"', 'crossorigin="anonymous"'];

  if (mstring.indexOf('<script') > -1) {
    return mstring.replace(/<script/, '<script ' + sriArguments.join(' ') + ' ');
  }

  if (mstring.indexOf('script(') > -1) {
    return mstring.replace(/script\(/, 'script(' + sriArguments.join(', ') + ', ');
  }

  if (mstring.indexOf('<link') > -1) {
    return mstring.replace(/<link/, '<link ' + sriArguments.join(' ') + ' ');
  }

  if (mstring.indexOf('link(') > -1) {
    return mstring.replace(/link\(/, 'link(' + sriArguments.join(', ') + ', ');
  }
}

function sriResources(options) {
  options = options || {};
  options.algo = options.algo || 'sha256';
  options.prefix = (options.prefix === false) ? false : true;
  var extensions = '{css,js}';
  var baseRegString = '(.*)(link|script)(.*)"(.*)$fileName$"(.*)';

  if (typeof options.fileExt === 'string') {
    extensions = options.fileExt;
  }

  if (Array.isArray(options.fileExt)) {
    extensions = '{' + options.fileExt.map(function(ext) {
      return ext.replace('.', '');
    }).join(',') + '}';
  }

  return through2.obj(function(file, enc, callback) {
    var contentString = file.contents.toString();
    var filePath = pathLib.relative(file.base, file.path);
    getSris(extensions, options.path || file.base, options, function(error, sris) {
      if (error) {
        callback(error);
        return;
      }

      sris.forEach(function(sri) {
        var srcFileName = pathLib.relative(filePath, sri.filePath).replace(/\.\.\//g, '');
        var matchString = baseRegString.replace('$fileName$', srcFileName);
        var regexp = new RegExp(matchString, 'g');
        var matches = contentString.match(regexp) || [];

        matches.forEach(function(mstring) {
          var newTagString = getNewTagString(mstring, sri.hash);
          contentString = contentString.replace(mstring, newTagString);
        });
      });

      file.contents = new Buffer(contentString, enc);
      callback(null, file);
    });
  });
}

module.exports = sriResources;
