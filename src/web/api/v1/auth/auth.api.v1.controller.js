const passport = require('koa-passport');

const AuthController = {
  /**
   */
  authenticate: passport.authenticate('bearer'),
};

module.exports = AuthController;
