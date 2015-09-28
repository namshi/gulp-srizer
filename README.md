# gulpSrizer

Easilly add the needed [w3c Sri informations](http://www.w3.org/TR/SRI/) to your html and jade files.

## Installation

Install this library via [NPM](https://www.npmjs.org/package/gulp-srizer):

``` bash
npm install gulp-srizer
```

## Usage
```javascript
var srizer = require('srizer');

gulp.task('sri', function() {
    return gulp.src('path/to/your/jade/or/html/files')
        .pipe(sriResources())
        .pipe(gulp.dest('/where/should/we/write/them'));
});

```

## Options:

* fileExt: resource's extension we want to add SRIs for (default: css, js)

example:
```javascript
sriResources({fileExt: 'css'});
// or
sriResources({fileExt: ['css', 'js']});
```

* path: where should we look for resource files. By default this path is inferred by the location of your html/jade files

example:
```javascript
sriResources({path: '/path/to/your/resources'});
```

## Tip and tricks:
If you're using [gulp-cdnizer](https://www.npmjs.com/package/gulp-cdnizer) or [gulp-rev-all](https://github.com/smysnk/gulp-rev-all) in your project, we suggest your `sri` task to be the last one.
