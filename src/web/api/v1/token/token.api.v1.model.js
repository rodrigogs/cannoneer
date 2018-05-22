const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const InvalidScopeError = require('./exceptions/InvalidScopeError');

const { Schema } = mongoose;

const DEFAULT_DURATION = 24 * (60 * (60 * 1000)); // 24h

const scopes = ['admin', 'user', 'message'];
const types = ['', 'admin', 'read', 'write'];

const scopeTypes = scopes.reduce((result, scope) => {
  result.push(...types.map(type => `${type}${type ? ':' : ''}${scope}`));
  return result;
}, []);

const isValidScope = scope => scopeTypes.indexOf(scope) !== -1;

const TokenModel = new Schema({
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  duration: {
    type: Number,
    default: DEFAULT_DURATION,
    required: true,
  },
  scopes: {
    type: [String],
    validate: {
      validator: function validator(scopes) {
        for (let i = 0, len = scopes.length; i < len; i += 1) {
          const scope = scopes[i];
          if (!isValidScope(scope)) throw new InvalidScopeError(scope);
        }
      },
    },
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
});

TokenModel.plugin(beautifyUnique);

module.exports = mongoose.model('Token', TokenModel);
