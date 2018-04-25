const MessageService = require('./message.api.v1.service');

const MessageController = {
  /**
   */
  status: async (ctx) => {
    ctx.throw(501, 'Not Implemented');
  },

  /**
   */
  send: async (ctx) => {
    const id = await MessageService.send(ctx.request.body);
    ctx.status = 200;
    ctx.body = { id };
  },

  /**
   */
  cancel: async (ctx) => {
    const { id } = ctx.params;

    await MessageService.cancel(id);
    ctx.status = 204;
  },
};

module.exports = MessageController;
