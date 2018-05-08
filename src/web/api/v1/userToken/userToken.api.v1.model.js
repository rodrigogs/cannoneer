const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

// Initialize refs
require('../user/user.api.v1.model');
require('../token/token.api.v1.model');

const UserTokenModel = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: ObjectId,
    required: true,
    ref: 'Token',
  },
}, {
  createdAt: true,
});

module.exports = mongoose.model('UserToken', UserTokenModel);
