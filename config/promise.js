const debug = require('debuggler')();
const bluebird = require('bluebird');

debug('configuring promise');

global.Promise = bluebird;

module.exports = bluebird;
