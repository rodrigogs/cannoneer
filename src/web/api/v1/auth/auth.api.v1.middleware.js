// const debug = require('debuggler')();
const passport = require('../../../../../config/passport');

passport.initializeBearerStrategy('bearer', {}, async (/* token, cb */) => {
  // TODO auth strategy
});

const AuthMiddleware = () => () => {
};

module.exports = AuthMiddleware;
