const debug = require('debuggler')();
const PassportConfig = require('../../../../../config/passport');
const AuthService = require('./auth.api.v1.service');
const UserRoleService = require('../userRole/userRole.api.v1.service');
const UnauthorizedError = require('./exceptions/UnauthorizedError');
const passport = require('koa-passport');

PassportConfig.initializeBearerStrategy('bearer', {}, async (token, done) => {
  debug(`authorizing token "${token}"`);

  try {
    const user = await AuthService.authorize(token);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const AuthMiddleware = role => async (ctx, next) => {
  debug('verifying if request is authenticated');

  return passport.authenticate('bearer', { session: false })(ctx, async () => {
    if (ctx.isAuthenticated()) {
      const type = UserRoleService.getMethodUserRoleType(ctx.method);
      if (role) await AuthService.ensureUserRoleAccess(ctx.state.user, role, type);

      return next();
    }

    debug('session is not authenticated');
    throw new UnauthorizedError();
  });
};

module.exports = AuthMiddleware;
