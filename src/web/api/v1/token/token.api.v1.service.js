const debug = require('debuggler')();
const Token = require('./token.api.v1.model');
const InactiveTokenError = require('./exceptions/InactiveTokenError');
const ExpiredTokenError = require('./exceptions/ExpiredTokenError');

const TokenService = {
  /**
   * @param {String} hash
   * @return {Promise<Token>}
   */
  get: async (hash) => {
    debug(`retrieving token for hash "${hash}"`);

    return Token.findOne({ hash }).exec();
  },

  /**
   * @param {Object} token
   * @return {Boolean}
   */
  validate: (token) => {
    const isExipired = (new Date().getTime() - token.createdAt.getTime()) > token.duration;

    if (!isExipired) throw new ExpiredTokenError(token);
    if (!token.active) throw new InactiveTokenError(token);
  },
};

module.exports = TokenService;
