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
   * @return {Promise<void>}
   */
  processMessages: async () => {
    const messageKeys = await redis.keysAsync('failed_message_*');

    const msgPromises = messageKeys.map(async (key) => {
      let msg = await redis.getAsync(key);
      msg = JSON.parse(msg);
      msg.key = key;

      return msg;
    });

    await Promise.each(msgPromises, async (message) => {
      const {
        id,
        url,
        key,
      } = message;

      try {
        await MessageService.deliverMessage(id, url, message);
        await MessageProcessorService.removeFromMemory(key);
      } catch (err) {
        logger.error(`Failed to deliver message "${id}" with error:`, err)
      }
    });
  },
};

module.exports = MessageProcessorService;
