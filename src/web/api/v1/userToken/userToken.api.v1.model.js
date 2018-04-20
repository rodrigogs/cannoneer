const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

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

module.exports = UserTokenModel;
