# jQuery plugin kurukuru

The best jQuery plugin ever.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/nak0yui/jquery.kurukuru.js/master/dist/jquery.kurukuru.min.js
[max]: https://raw.github.com/nak0yui/jquery.kurukuru.js/master/dist/jquery.kurukuru.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.kurukuru.js.min.js"></script>
<script>
jQuery(function($) {
  $().kurukuru();
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
* 0.2.0: Upgrading from grunt 0.3 to grunt 0.4.
* 0.1.0: Init.

## License
Copyright (c) 2012 nak  
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt-cli` to install the latest version. _You may need to run `sudo npm install -g grunt-cli`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.
