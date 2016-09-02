const webpack = require('webpack');
const path = require('path');

module.exports = function () {
  return {
    entry: {
      centerfold: "./src/scripts/main"
    },
    output: {
      path: path.join(__dirname, '.tmp'),
      library: '[name]',
      libraryTarget: 'umd',
      filename: '[name].js'
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel!ts'
        },
        { test: /\.hbs$/, loader: "handlebars" }
      ]
    },
    resolve: {
      extensions: ["", ".min.js", ".js", ".ts"]
    },
    devtool: 'source-map',
    ts: {
      silent: true
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin()
    ]
  }
};
