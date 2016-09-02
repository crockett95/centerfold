module.exports = function (config) {
  'use strict';

  var shared = require('./karma.shared.conf')(config);
  shared.files.push('test/integration/main.ts');
  shared.port = 9877;

  config.set(shared);
}
