const debug = require('debuggler')();
const TokenService = require('../token/token.api.v1.service');
const UserTokenService = require('../userToken/userToken.api.v1.service');
const UserService = require('../user/user.api.v1.service');
const UnauthorizedError = require('./exceptions/UnauthorizedError');
const UnauthorizedScopeError = require('./exceptions/UnauthorizedScopeError');
const BadRequestError = require('./exceptions/BadRequestError');
const BadCredentialsError = require('./exceptions/BadCredentialsError');
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
 * @param {String} token
 * @return {Promise<UserToken>}
 */
const resolveUserToken = async (token) => {
  let userToken = await redis.getAsync(`user:token:${token}`).then(JSON.parse);
  if (!userToken) {
    userToken = await UserTokenService.get(token);
    if (userToken) await redis.setAsync(`user:token:${token}`, JSON.stringify(userToken));
  }

  return userToken;
};

const AuthService = {
  /**
   * @param {String} username
   * @param {String} password
   * @param {String[]} scopes
   * @return {Promise<UserToken>}
   */
  authenticate: async (username, password, scopes) => {
    if (!username) throw new BadRequestError('Username is required');
    if (!password) throw new BadRequestError('Password is required');

    const user = await UserService.findOne({ username });
    if (!user) throw new BadCredentialsError();
    if (!user.comparePassword(password)) throw new BadCredentialsError();

    return UserTokenService.create(user, scopes);
  },

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
      return (s.type === type || s.type === 'admin')
        && (s.name === scope || s.name === 'admin');
    });

    if (hasScope) return;

    debug('user have no scope for the requested operation');
    throw new UnauthorizedScopeError(type, scope);
  },
};

module.exports = AuthService;
