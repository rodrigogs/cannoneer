const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

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
  type: {
    type: String,
    enum: ['R', 'W', 'RW'],
    required: true,
  },
});

UserRoleModel.plugin(beautifyUnique);

module.exports = mongoose.model('UserRole', UserRoleModel);
