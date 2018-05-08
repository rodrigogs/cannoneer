const debug = require('debuggler')();
const TokenService = require('../token/token.api.v1.service');
const UserTokenService = require('../userToken/userToken.api.v1.service');
const UserRoleService = require('../userRole/userRole.api.v1.service');
const UserNotFoundError = require('./exceptions/UserNotFoundError');
const InvalidTokenError = require('./exceptions/InvalidTokenError');

const AuthService = {
  authorize: async (token) => {
    debug(`authorizing token "${token}"`);
    const { token: tk, user } = await UserTokenService.get(token);
    if (!tk) throw new InvalidTokenError(token);
    if (!user) throw new UserNotFoundError(token);

    debug(`validating token "${token}"`);
    TokenService.validate(tk);

    return user;
  },

  ensureUserRoleAccess: async (user) => {
    const role = await UserRoleService.getRole(user);
  },
};

module.exports = AuthService;
