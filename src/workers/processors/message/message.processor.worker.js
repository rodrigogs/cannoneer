const debug = require('debuggler')();
const Env = require('../../../../config/env');
const { CronJob } = require('cron');
const redis = require('../../../../config/redis');
const logger = require('../../../../config/logger');
const MessageService = require('./message.processor.service');

/**
 * @module MessageProcessorWorker
 */
const MessageProcessorWorker = {
  name: 'MessageWorker',

  running: false,

  /**
   * @return {Promise<void>}
   */
  run: async () => {
    if (MessageProcessorWorker.running) return debug('worker is busy');

    debug('worker running');

    MessageProcessorWorker.running = true;

    try {
      await MessageService.processMessages();
    } catch (err) {
      logger.error(err);
    } finally {
      MessageProcessorWorker.running = false;
      debug('worker halt');
    }
  },

  /**
   * @return {Promise<*|Promise<*>>}
   */
  keepAlive: async () => {
    try {
      const workerInfo = {
        instanceId: Env.INSTANCE_ID,
        lastSeen: new Date(),
      };

      await redis.setAsync(`msgwrkr:instance:${Env.INSTANCE_ID}`, JSON.stringify(workerInfo));
      await Promise.delay(30000);

      return MessageProcessorWorker.keepAlive();
    } catch (err) {
      logger.error('Error executing keep alive routine', err);
    }
  },
};

exports.worker = MessageProcessorWorker;

/**
 * @param {String} cronPattern
 * @return {CronJob}
 */
exports.schedule = cronPattern => new CronJob({
  cronTime: cronPattern,
  onTick: MessageProcessorWorker.run,
  start: false,
});

/**
 * @return {Promise<void>}
 */
exports.setup = async () => {
  await redis.waitForReady();

  MessageProcessorWorker.keepAlive();
};
