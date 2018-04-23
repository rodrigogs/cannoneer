const debug = require('debuggler')();

debug('initializing app configuration');

const Env = require('./env');
const logger = require('./logger');
const promise = require('./promise');
const redis = require('./redis');
const status = require('./status');
const passport = require('./passport');
const mongoose = require('./mongoose');

module.exports = {
  Env,
  logger,
  promise,
  redis,
  status,
  passport,
  mongoose,
};
