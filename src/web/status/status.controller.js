const debug = require('debuggler')();
const StatusService = require('./status.service');

const StatusController = {
  /**
   */
  get: async (ctx) => {
    debug('retrieving status');

    ctx.body = await StatusService.getStatus();
  },
};

module.exports = StatusController;
