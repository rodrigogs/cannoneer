const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const RoleModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: ObjectId,
    required: true,
  },
  token: {
    type: ObjectId,
    required: false,
    unique: true,
  },
});

module.exports = RoleModel;
