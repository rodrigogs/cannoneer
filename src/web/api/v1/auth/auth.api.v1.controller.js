const debug = require('debuggler')();
const AuthService = require('./auth.api.v1.service');
const passport = require('koa-passport');

const AuthController = {
  /**
   */
  login: passport.authenticate('bearer'),
};

module.exports = AuthController;
