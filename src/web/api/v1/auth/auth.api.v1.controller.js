const debug = require('debuggler')();
const AuthService = require('./auth.api.v1.service');
const UserTokenSchema = require('../userToken/userToken.api.v1.schema');
const JSONUtils = require('../../../../util/json.util');

const UserTokenNormalizer = JSONUtils.normalize(UserTokenSchema);

const AuthController = {
  /**
   */
  jwt: async (ctx) => {
    debug('authenticating with jwt...');
    const { username, password, scopes } = ctx.request.body;

    const userToken = await AuthService.authenticateJwt(username, password, scopes);
    ctx.status = 200;
    ctx.body = UserTokenNormalizer(userToken.toObject());
  },

  refreshJwt: async (ctx) => {
    debug('refreshing token for jwt...');
    const { refreshToken } = ctx.request.body;

    const userToken = await AuthService.refreshJwt(refreshToken);
    ctx.status = 200;
    ctx.body = UserTokenNormalizer(userToken.toObject());
  },
};

module.exports = AuthController;
