var config = require('./webpack.shared.config')();
const webpack = require('webpack');

config.entry.unit = './test/unit/main';
config.entry.integration = './test/integration/main';
config.debug = true;
config.plugins.push(new webpack.NoErrorsPlugin());
config.output.publicPath = '/scripts';

module.exports = config;
