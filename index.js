'use strict';

var sri = require('node-sri');
var through2 = require('through2');
var gStrem = require('glob-stream');

function getSris(extensions, path, callback) {
    var sris = [];
    var src = path + '**/*.' + extensions;

    gStrem.create(src)
    .pipe(through2.obj(function(file, enc, cb) {
        var filePath = require('path').relative(file.base, file.path);
        sri.hash(file.path, function(error, hash){
            if (error) {
                throw error;
            }

            sris.push({ filePath: filePath, hash: hash });
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
    var sriArguments = ['integrity="' + hash +'"', 'crossorigin="anonymous"'];

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
    var extensions = '{css,js}';
    var baseRegString = '(.*)(link|script)(.*)"$fileName$"(.*)';

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
        getSris(extensions, options.path || file.base, function(error, sris) {
            if (error) {
                callback(error);
            }

            sris.forEach(function(sri) {
                var matchString = baseRegString.replace('$fileName$', sri.filePath);
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
