const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const RoleModel = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  ref: {
    type: String,
    required: true,
    unique: true,
  },
});

RoleModel.plugin(beautifyUnique);

module.exports = mongoose.model('Role', RoleModel);
