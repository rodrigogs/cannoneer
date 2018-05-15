const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

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
  timestamps: {
    createdAt: true,
  },
});

UserTokenModel.plugin(beautifyUnique);

module.exports = mongoose.model('UserToken', UserTokenModel);
