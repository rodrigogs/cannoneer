const mongoose = require('mongoose');

const { Schema } = mongoose;

const DEFAULT_DURATION = 24 * (60 * (60 * 1000)); // 24h

const TokenModel = new Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    default: true,
    required: true,
  },
  duration: {
    default: DEFAULT_DURATION,
    required: true,
  },
}, {
  createdAt: true,
  updatedAt: true,
});

module.exports = TokenModel;
