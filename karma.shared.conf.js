var webpack = require('karma-webpack');
var webpackConfig = require('./webpack.test.config');

module.exports = function (config) {
  return {
    frameworks: [ 'mocha', 'chai-as-promised', 'chai', 'sinon' ],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
    ],
    plugins: [
      webpack,
      'karma-mocha',
      'karma-chai-as-promised',
      'karma-chai',
      'karma-sinon',
      'karma-phantomjs-launcher'
    ],
    browsers: [ 'PhantomJS' ],
    preprocessors: {
      '**/*.ts': ['webpack']
    },
    reporters: [ 'dots'],
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    port: 9876,
    concurrency: Infinity,
    logLevel: config.LOG_WARN
  };
};
