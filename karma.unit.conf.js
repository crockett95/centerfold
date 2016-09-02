module.exports = function (config) {
  'use strict';

  var shared = require('./karma.shared.conf')(config);

  shared.files.push('test/unit/**/*.spec.ts');
  shared.plugins.push('karma-coverage');
  shared.reporters.push('coverage');
  shared.coverageReporter = {
    dir: '.tmp/coverage',
    reporters: [
      { type: 'json', subdir: '.', file: 'coverage.json' },
      { type: 'html', subdir: '.' }
    ]
  };

  config.set(shared);
};
