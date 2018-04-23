const debug = require('debuggler')();
const User = require('./user.api.v1.model');
const InvalidUpdateFieldError = require('./exceptions/InvalidUpdateFieldError');
const _ = require('lodash');

const UserService = {
  get: async (id) => {
    debug('retrieving user', id);

    return User.findById(id).exec();
  },

  find: async (query, limit = 10, sort) => {
    debug('retrieving users', query);

    return User.find(query)
      .limit(limit)
      .sort(sort)
      .exec();
  },

  create: async (user) => {
    debug('creating user', user);

    user = new User(user);

    return user.save();
  },

  update: async (id, updates) => {
    debug('updating user', id);

    const updateableFields = [
      'name',
      'email',
      'about',
      'username',
      'password',
    ];

    Object.keys(updates).forEach((prop) => {
      if (!_.includes(updateableFields, prop)) throw new InvalidUpdateFieldError(prop);
    });

    return User.update({ _id: id }, { $set: updates });
  },

  disable: async (id) => {
    debug('disabling user', id);

    return User.update({ _id: id }, { $set: { active: false } });
  },
};

module.exports = UserService;
