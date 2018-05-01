const fs = require('fs');
const path = require('path');
const ini = require('ini');

module.exports = function () {
  if (process.env.CAPTUROO_PRIVATE_API_KEY) {
    return process.env.CAPTUROO_PRIVATE_API_KEY;
  }

  const HOME = (function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  })();
  const rcFile = path.resolve(HOME, '.capturoo');

  if (fs.existsSync(rcFile)) {
    let config = ini.parse(fs.readFileSync(rcFile, 'utf8'));
    if (config.hasOwnProperty('default') && config.default.hasOwnProperty('private_api_key')) {
      return config.default.private_api_key;
    }
  }

  return undefined;
}
