const mongoose = require('mongoose');
const crypto = require('crypto');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const validateLength = (min = 0) => (max = Number.MAX_SAFE_INTEGER) => ({
  validator: val => !val || ((val.length >= min) && (val.length <= max)),
  message: `Field "{PATH}" length must be between ${min} and ${max}`,
});

const UserModel = new Schema({
  name: {
    type: String,
    required: true,
    validate: validateLength(4)(80),
  },
  email: {
    type: String,
    required: false,
    validate: validateLength(5)(320),
  },
  about: {
    type: String,
    required: false,
    validate: validateLength(5)(300),
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: validateLength(4)(15),
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
});

UserModel.virtual('password')
  .set(function set(password) {
    this._plain_password = password;
    this.salt = crypto.randomBytes(128).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function get() {
    return this._plain_password;
  });

UserModel.methods.encryptPassword = function encryptPassword(password) {
  return crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

UserModel.methods.comparePassword = function comparePassword(candidatePassword) {
  return this.encryptPassword(candidatePassword) === this.hashedPassword;
};

UserModel.plugin(beautifyUnique);

module.exports = mongoose.model('User', UserModel);
