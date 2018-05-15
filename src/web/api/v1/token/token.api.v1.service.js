const debug = require('debuggler')();
const Token = require('./token.api.v1.model');
const InactiveTokenError = require('./exceptions/InactiveTokenError');
const ExpiredTokenError = require('./exceptions/ExpiredTokenError');
const uuidv4 = require('uuid/v4');

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
   * @param {String} salt
   * @param {String[]} scopes
   * @return {Promise<Token>}
   */
  create: async (salt, scopes) => {
    const hash = uuidv4(256);
    return new Token({ hash: hash + salt, scopes }).save();
  },

  /**
   * @param {Object} token
   * @return {Boolean}
   */
  validate: (token) => {
    const createdAt = new Date(token.createdAt);
    const isExipired = (new Date().getTime() - createdAt.getTime()) > token.duration;

    if (isExipired) throw new ExpiredTokenError(token.hash);
    if (!token.active) throw new InactiveTokenError(token.hash);
  },
};

module.exports = TokenService;
