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
    ctx.throw(501, 'Not Implemented');
  },
};

module.exports = MessageController;
