const debug = require('debuggler')();
const UserService = require('./user.api.v1.service');
const UserSchema = require('./user.api.v1.schema');
const JSONUtils = require('../../../../util/json.util');

const UserNormalizer = JSONUtils.normalize(UserSchema);

const UserController = {
  /**
   */
  get: async (ctx) => {
    debug(`retrieving user "${ctx.request.params.id}"`);

    const { id } = ctx.request.params;
    const user = await UserService.findOne({ _id: id }).exec();

    ctx.status = 200;
    ctx.body = UserNormalizer(user.toObject());
  },

  /**
   */
  create: async (ctx) => {
    debug('creating user', ctx.request.body);

    const { body } = ctx.request;
    const user = await UserService.create(body);

    ctx.status = 201;
    ctx.body = UserNormalizer(user.toObject());
  },

  /**
   */
  update: async (ctx) => {
    debug(`updating user "${ctx.request.params.id}"`);

    const { id } = ctx.request.params;
    const { body } = ctx.request;

    await UserService.update(id, body);

    ctx.status = 204;
  },

  /**
   */
  disable: async (ctx) => {
    debug(`disabling user "${ctx.request.params.id}"`);

    const { id } = ctx.request.params;

    await UserService.disable(id);

    ctx.status = 204;
  },
};

module.exports = UserController;
