const debug = require('debuggler')();
const Env = require('../../../../../config/env');
const PassportConfig = require('../../../../../config/passport');
const AuthService = require('./auth.api.v1.service');
const UnauthorizedError = require('./exceptions/UnauthorizedError');
const passport = require('koa-passport');

PassportConfig.initializeBearerStrategy('bearer', {}, async (token, done) => {
  if (!Env.AUTH_ENABLED) {
    debug('authentication is disabled');
    done(null, null);
  }

  debug(`authorizing token "${token}"`);

  try {
    const userToken = await AuthService.authorize(token);
    done(null, userToken);
  } catch (err) {
    done(err);
  }
});

const getMethodType = method => ({
  GET: 'read',
  PUT: 'write',
  POST: 'write',
  DELETE: 'write',
}[method.toUpperCase()]);

const AuthMiddleware = {
  /**
   * @return {*}
   */
  authenticate: () => passport.authenticate('bearer', { session: false }),

  /**
   * @param {String} scope
   * @return {*}
   */
  grant: (scope) => {
    if (!scope) throw new Error('Scope must be specified.');

    return async (ctx, next) => {
      debug(`verifying if authenticated user has grant "${scope}"`);

      if (ctx.isAuthenticated()) {
        const type = getMethodType(ctx.method);
        if (scope) await AuthService.ensureScopeAccess(ctx.state.user.token, scope, type);

        return next();
      }

      debug('session is not authenticated');
      throw new UnauthorizedError();
    };
  },
};

module.exports = AuthMiddleware;
