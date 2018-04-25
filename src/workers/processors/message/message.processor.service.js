const debug = require('debuggler')();
const redis = require('../../../../config/redis');
const logger = require('../../../../config/logger');
const MessageService = require('../../../web/api/v1/message/message.api.v1.service');

const MessageProcessorService = {
  removeFromMemory: async (key, attempt = 0) => {
    try {
      debug(`removing key "${key}" from redis`);
      await redis.delAsync(key);
    } catch (err) {
      const retryIn = Math.min(attempt * 100, 60000);

      logger.error(`Failed to remove key "${key}" from redis`, err);
      logger.info(`Retrying in ${retryIn / 1000} seconds...`);

      await Promise.delay(retryIn);

      return MessageProcessorService.removeFromMemory(key, attempt + 1);
    }
  },

  /**
   * @param {Number} page
   * @param {Number} limit
   * @return {Promise<Object>}
   */
  getPaginatedMessages: async (page = 0, limit = 10) => {
    const [cursor, keys] = await redis
      .scanAsync(String(page), 'MATCH', 'messages:failed*', 'COUNT', String(limit));

    const messagePromises = keys.map(async (key) => {
      let msg = await redis.getAsync(key);
      msg = JSON.parse(msg);
      msg.key = key;

      return msg;
    });

    const messages = await Promise.all(messagePromises);
    return { cursor, messages };
  },

  /**
   * @return {Promise<void>}
   */
  processMessages: async (cursor = 0) => {
    const { cursor: next, messages: page } = await MessageProcessorService
      .getPaginatedMessages(cursor);

    try {
      await Promise.each(page, async (message) => {
        const {
          id,
          url,
          key,
        } = message;

        try {
          await MessageService.deliverMessage(id, url, message);
          await MessageProcessorService.removeFromMemory(key);
        } catch (err) {
          logger.error(`Failed to deliver message "${id}" with error:`, err.message);
        }
      });
    } finally {
      if (next !== '0') {
        await MessageProcessorService.processMessages(next);
      }
    }
  },
};

module.exports = MessageProcessorService;
