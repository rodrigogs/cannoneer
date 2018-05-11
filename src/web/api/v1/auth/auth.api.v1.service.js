const debug = require('debuggler')();
const TokenService = require('../token/token.api.v1.service');
const UserTokenService = require('../userToken/userToken.api.v1.service');
const UnauthorizedError = require('./exceptions/UnauthorizedError');
const UnauthorizedScopeError = require('./exceptions/UnauthorizedScopeError');
const redis = require('../../../../../config/redis');

/**
 * @param {String[]} scopes
 * @return {*}
 */
const normalizeScopes = scopes => scopes.map((s) => {
  const parts = s.split(':');

  let type = 'read';
  let name;

  if (parts.length === 1) {
    [name] = parts;
  } else if (parts.length === 2) {
    [type, name] = parts;
  }

  return { type, name };
});

/**
 * @param {Object} token
 * @return {Promise<UserToken>}
 */
const resolveUserToken = async (token) => {
  let userToken = await redis.getAsync(`user:token:${token._id}`).then(JSON.parse);
  if (!userToken) {
    userToken = await UserTokenService.get(token);
    await redis.setAsync(`user:token:${token._id}`, JSON.stringify(userToken));
  }

  return userToken;
};

const AuthService = {
  /**
   * @param {String} token
   * @return {Promise<UserToken>}
   */
  authorize: async (token) => {
    debug(`authorizing token "${token}"`);
    const userToken = await resolveUserToken(token);
    if (!userToken) throw new UnauthorizedError();

    debug(`validating token "${token}"`);
    TokenService.validate(userToken.token);

    return userToken;
  },

  /**
   * @param {Object} token
   * @param {String} scope
   * @param {String} type
   * @return {Promise<void>}
   */
  ensureScopeAccess: async (token, scope, type) => {
    debug('ensuring user role access');

    const scopes = normalizeScopes(token.scopes);

    const hasScope = scopes.find((s) => {
      return s.type === type
        && s.name === scope;
    });

    if (hasScope) return;

    debug('user have no scope for the requested operation');
    throw new UnauthorizedScopeError(type, scope);
  },
};

module.exports = AuthService;
