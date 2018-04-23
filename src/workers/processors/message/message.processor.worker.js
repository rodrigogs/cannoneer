const debug = require('debuggler')();
const { CronJob } = require('cron');
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
      MessageService.processMessages();
    } catch (err) {
      logger.error(err);
    } finally {
      MessageProcessorWorker.running = false;
      debug('worker halt');
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
  start: true,
});
