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
    type: Boolean,
    default: true,
    required: true,
  },
  duration: {
    type: Number,
    default: DEFAULT_DURATION,
    required: true,
  },
}, {
  createdAt: true,
  updatedAt: true,
});

module.exports = mongoose.model('Token', TokenModel);
