const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const UserRoleModel = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  role: {
    type: ObjectId,
    required: true,
    ref: 'Role',
  },
});

module.exports = UserRoleModel;
