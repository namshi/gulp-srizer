# gulpSrizer
[![Build Status](https://travis-ci.org/namshi/gulp-srizer.svg?branch=master)](https://travis-ci.org/namshi/gulp-srizer)

Easilly add the needed [w3c Sri informations](http://www.w3.org/TR/SRI/) to your html and jade files.

## Installation

Install this library via [NPM](https://www.npmjs.org/package/gulp-srizer):

``` bash
npm install gulp-srizer --save
```

## Usage
```javascript
var srizer = require('gulp-srizer');

gulp.task('sri', function() {
    return gulp.src('path/to/your/jade/or/html/files')
        .pipe(srizer())
        .pipe(gulp.dest('/where/should/we/write/them'));
});

```

## Options:

* fileExt: resource's extension we want to add SRIs for (default: css, js)

example:
```javascript
srizer({fileExt: 'css'});
// or
srizer({fileExt: ['css', 'js']});
```

* path: where should we look for resource files. By default this path is inferred by the location of your html/jade files

example:
```javascript
srizer({path: '/path/to/your/resources'});
```

* algo: which hashing algorithm should be used (default: sha256)

example:
```javascript
srizer({algo: 'sha512'});
```

* prefix: where should we prepend of not the algorithm to the has or not (default: true)

example:
```javascript
srizer({prefix: false});
```

## Tip and tricks:
If you're using [gulp-cdnizer](https://www.npmjs.com/package/gulp-cdnizer) or [gulp-rev-all](https://github.com/smysnk/gulp-rev-all) in your project, we suggest your `sri` task to be the last one.

##Tests
Have [mocha](https://mochajs.org/) installed and: `npm test`
