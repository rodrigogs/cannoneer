const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;

const validateLength = (min = 0) => (max = Number.MAX_SAFE_INTEGER) => ({
  validator: val => !val || ((val.length >= min) && (val.length <= max)),
  message: `Field "{PATH}" length must be between ${min} and ${max}`,
});

const UserSchema = new Schema({
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
  createdAt: true,
  updatedAt: true,
});

UserSchema.virtual('password')
  .set(function set(password) {
    this._plain_password = password;
    this.salt = crypto.randomBytes(128).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function get() {
    return this._plain_password;
  });

UserSchema.methods.encryptPassword = function encryptPassword(password) {
  return crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return this.encryptPassword(candidatePassword) === this.hashedPassword;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
