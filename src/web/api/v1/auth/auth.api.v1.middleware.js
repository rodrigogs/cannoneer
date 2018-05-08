const debug = require('debuggler')();
const passport = require('../../../../../config/passport');
const AuthService = require('./auth.api.v1.service');
const UnauthorizedError = require('./exceptions/UnauthorizedError');

passport.initializeBearerStrategy('bearer', {}, async (token, done) => {
  try {
    const user = await AuthService.authorize(token);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const AuthMiddleware = role => async (ctx, next) => {
  debug('verifying if request is authenticated');
  if (ctx.isAuthenticated()) {
    if (role) await AuthService.ensureUserRoleAccess(ctx.state.user, role);

    return next();
  }

  debug('session is not authenticated');
  throw new UnauthorizedError();
};

module.exports = AuthMiddleware;
