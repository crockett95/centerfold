var config = require('./webpack.shared.config')();
const path = require('path');

config.module.loaders = [
  {
    test: /\.tsx?$/,
    exclude: [
      path.resolve('src'),
      path.resolve('node_modules'),
      path.resolve('bower_components')
    ],
    loader: 'babel!ts'
  }, {
    test: /\.tsx?$/,
    include: path.resolve('src'),
    loader: 'isparta!ts'
  },
  { test: /\.hbs$/, loader: "handlebars" }
];

config.devtool = 'inline-source-map';

module.exports = config;
