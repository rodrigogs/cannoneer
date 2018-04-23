const debug = require('debuggler')();
const axios = require('axios');
const logger = require('../../../../../config/logger');
const MessageSchema = require('./message.api.v1.model');
const redis = require('../../../../../config/redis');
const { ObjectId } = require('mongoose').Types;
const Ajv = require('ajv');
const InvalidMessageSchemaError = require('./exceptions/InvalidMessageSchemaError');
const InvalidResponseStatusError = require('./exceptions/InvalidResponseStatusError');
const InvalidResponseSchemaError = require('./exceptions/InvalidResponseSchemaError');

const ajv = new Ajv();

const MessageService = {
  /**
   * @param {Object} expected
   * @param {Object} response
   */
  validateResponse: (expected = {}, response) => {
    const { status, body } = expected;

    if (status) {
      if (status !== response.status) throw new InvalidResponseStatusError(status, response.status);
    }

    if (body) {
      const validate = ajv.compile(body);
      const valid = validate(response.data);
      if (!valid) throw new InvalidResponseSchemaError(validate.errors);
    }
  },

  /**
   * @param id
   * @param url
   * @param message
   * @return {Promise<void>}
   */
  deliverMessage: async (id, url, message) => {
    const {
      method,
      payload: data,
      headers,
      expected,
    } = message;

    const response = await axios({
      url,
      method,
      data,
      headers,
    });

    MessageService.validateResponse(expected, response);
  },

  /**
   * @param {String} id
   * @param {String} url
   * @param {Object} message
   * @param {Number} attempt
   * @return {Promise<void>}
   */
  tryToSend: async (id, url, message, attempt = 0) => {
    try {
      await MessageService.deliverMessage(id, url, message);
    } catch (err) {
      logger.error(`Failed to send message to "${url}" with error`, err);

      try {
        message.id = id;
        message.url = url;
        await redis.setAsync(`failed_message_${id}_${url}`, JSON.stringify(message));
      } catch (err) {
        const retryIn = Math.min(attempt * 100, 60000);

        logger.error('Error sending message to redis', err);
        logger.info(`Retrying to send message in ${retryIn / 1000} seconds...`);

        await Promise.delay(retryIn);

        return MessageService.tryToSend(id, url, message, attempt + 1);
      }
    }
  },

  processMessage: (message) => {
    const { destinations } = message;
    delete message.destinations;

    const ids = [];

    const promises = destinations.map((destination) => {
      const id = new ObjectId();

      ids.push({ destination, id });

      return MessageService.tryToSend(id, destination, message);
    });

    Promise.all(promises)
      .catch((err) => {
        logger.error('[CRITICAL ERROR]', err);
      });

    return ids;
  },

  /**
   * @param {Object} message Message object.
   * @return {Promise<String>}
   */
  send: async (message) => {
    const valid = MessageSchema(message);
    if (!valid) {
      throw new InvalidMessageSchemaError(MessageSchema.errors);
    }

    return MessageService.processMessage(message);
  },
};

module.exports = MessageService;
