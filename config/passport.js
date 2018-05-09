const debug = require('debuggler')();
const passport = require('koa-passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

debug('configuring passport');

const initializeBearerStrategy = (name, options, callback) => passport
  .use(name, new BearerStrategy(options, callback));

module.exports = {
  initializeBearerStrategy,
};
