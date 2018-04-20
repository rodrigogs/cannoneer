const debug = require('debuggler')();
const UserService = require('./user.api.v1.service');

const UserController = {
  /**
   */
  get: async (ctx) => {

  },

  /**
   */
  create: async (ctx) => {
    const { body } = ctx;

    ctx.body = await UserService.create(body);
  },

  /**
   */
  update: async (ctx) => {

  },
};

module.exports = UserController;
