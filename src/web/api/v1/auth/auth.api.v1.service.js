const debug = require('debuggler')();
const TokenService = require('../token/token.api.v1.service');
const UserTokenService = require('../userToken/userToken.api.v1.service');
const UserRoleService = require('../userRole/userRole.api.v1.service');
const UnauthorizedError = require('./exceptions/UnauthorizedError');

const AuthService = {
  authorize: async (token) => {
    debug(`authorizing token "${token}"`);
    const userToken = await UserTokenService.get(token);
    if (!userToken) throw new UnauthorizedError();

    debug(`validating token "${token}"`);
    TokenService.validate(userToken.token);

    return userToken.user;
  },

  ensureUserRoleAccess: async (user, role, type) => {
    debug('ensuring user role access');

    const hasRole = await UserRoleService.hasRole(user, role, type);
    if (hasRole) return;

    debug('user have no role for the requested operation');
    throw new UnauthorizedError();
  },
};

module.exports = AuthService;
