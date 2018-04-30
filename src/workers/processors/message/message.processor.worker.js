const debug = require('debuggler')();
const Env = require('../../../../config/env');
const { CronJob } = require('cron');
const redis = require('../../../../config/redis');
const logger = require('../../../../config/logger');
const MessageProcessorService = require('./message.processor.service');

/**
 * @module MessageProcessorWorker
 */
const MessageProcessorWorker = {
  name: 'MessageWorker',

  id: null,

  running: false,

  lastSeen: null,

  /**
   * @return {Promise<void>}
   */
  run: async () => {
    if (MessageProcessorWorker.running) return debug('worker is busy');

    debug('worker running');

    MessageProcessorWorker.running = true;

    try {
      debug('processing messages');
      await MessageProcessorService.processMessages(MessageProcessorWorker.id);
    } catch (err) {
      logger.error(err);
    } finally {
      MessageProcessorWorker.running = false;
      debug('worker halt');
    }
  },

  kill: async (retries = 0) => {
    debug(`killing worker "${MessageProcessorWorker.id}" `);

    if (MessageProcessorWorker.running && retries < 60) {
      debug(`worker "${MessageProcessorWorker.id}" is busy, waiting for work completion`);

      await Promise.delay(1000);
      return MessageProcessorWorker.kill(retries + 1);
    }

    try {
      const oldKey = MessageProcessorService.getWorkerKey({
        id: MessageProcessorWorker.id,
        status: 'alive',
      });

      const newKey = MessageProcessorService.getWorkerKey({
        id: MessageProcessorWorker.id,
        status: 'dead',
      });

      debug(`changing worker ${MessageProcessorWorker.id} status to "dead"`);
      await redis.renameAsync(oldKey, newKey);
    } catch (err) {
      debug(`failed to change worker ${MessageProcessorWorker.id} status to "dead": ${err.meesage}`);
      process.exit(1);
    } finally {
      process.exit(0);
    }
  },

  /**
   * @return {Promise<*|Promise<*>>}
   */
  keepAlive: async () => {
    if (MessageProcessorWorker.lastSeen) {
      if (MessageProcessorService.isWorkerDead(MessageProcessorWorker)) {
        debug(`not seen for more then 2 minutes, killing worker ${MessageProcessorWorker.id}`);
        return MessageProcessorWorker.kill();
      }
    }

    try {
      const workerInfo = {
        id: MessageProcessorWorker.id || Env.INSTANCE_ID,
        lastSeen: new Date(),
      };

      MessageProcessorWorker.id = workerInfo.id;

      debug(`executing keep alive for worker "${workerInfo.id}"`);

      await redis.setAsync(MessageProcessorService.getWorkerKey({
        id: workerInfo.id,
        status: 'alive',
      }), JSON.stringify(workerInfo));

      MessageProcessorWorker.lastSeen = workerInfo.lastSeen;

      debug(`successfully executed keep alive for worker "${workerInfo.id}"`);

      await Promise.delay(30000);
    } catch (err) {
      logger.error('Error executing keep alive routine', err);
    } finally {
      await MessageProcessorWorker.keepAlive();
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
  const startupDelay = Math.floor(Math.random() * 15000) + 5000;

  await Promise.delay(startupDelay);

  debug('configuring new worker');

  await redis.waitForReady();

  const deadWorker = await MessageProcessorService.findDeadWorker();
  const workerHasMessages = deadWorker
    ? await MessageProcessorService.workerHasMessages(deadWorker.id)
    : false;

  if (deadWorker && !workerHasMessages) {
    debug(`found dead worker "${deadWorker.id}" with no messages`);

    const key = await MessageProcessorService.getWorkerKeyById(deadWorker.id);
    await MessageProcessorService.removeFromMemory(key);

    debug(`dead worker "${deadWorker.id}" removed from memory`);

    return exports.setup();
  }

  if (deadWorker) {
    logger.info(`Dead worker "${deadWorker.id}" found`);
    try {
      logger.info(`Claiming dead worker "${deadWorker.id}"`);
      await MessageProcessorService.claimWorker(deadWorker.id);
      logger.info(`Successfully claimed worker "${deadWorker.id}"`);
      MessageProcessorWorker.id = deadWorker.id;
    } catch (err) {
      logger.error(`Failed claiming dead worker "${deadWorker.id}"`, err);
      return exports.setup();
    }
  }

  if (Env.MESSAGE_PROCESSOR_LIFETIME) {
    debug(`programming worker to die after "${Env.MESSAGE_PROCESSOR_LIFETIME}" millis`);
    setTimeout(MessageProcessorWorker.kill, Env.MESSAGE_PROCESSOR_LIFETIME);
  }

  debug('starting keep alive routine');
  MessageProcessorWorker.keepAlive()
    .then(() => debug(`worker "${MessageProcessorWorker.id}" keep alive routine stopped`))
    .catch(logger.error);
};

process.on('SIGINT', () => {
  debug(`termination routine triggered for worker "${MessageProcessorWorker.id}"`);

  MessageProcessorWorker.kill();
});
