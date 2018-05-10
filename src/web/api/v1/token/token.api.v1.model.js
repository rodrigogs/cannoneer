const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const DEFAULT_DURATION = 24 * (60 * (60 * 1000)); // 24h

const TokenModel = new Schema({
  hash: {
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
  },
}, {
  createdAt: true,
  updatedAt: true,
});

TokenModel.methods.normalizedScopes = function normalizedScopes() {
  return this.scopes.map((s) => {
    const [type, scope] = s.split(':');
    return { type, scope };
  });
};

TokenModel.plugin(beautifyUnique);

module.exports = mongoose.model('Token', TokenModel);
