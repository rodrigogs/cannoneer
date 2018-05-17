const debug = require('debuggler')();
const Env = require('../../../config/env');
const { CronJob } = require('cron');
const redis = require('../../../config/redis');
const logger = require('../../../config/logger');
const MessageProcessorService = require('./message.worker.service');

/**
 * @module MessageProcessorWorker
 */
const MessageWorker = {
  name: 'MessageWorker',

  id: null,

  running: false,

  lastSeen: null,

  /**
   * @return {Promise<void>}
   */
  run: async () => {
    if (MessageWorker.running) return debug('worker is busy');

    debug('worker running');

    MessageWorker.running = true;

    try {
      debug('processing messages');
      await MessageProcessorService.processMessages(MessageWorker.id);
    } catch (err) {
      logger.error(err);
    } finally {
      MessageWorker.running = false;
      debug('worker halt');
    }
  },

  kill: async (retries = 0) => {
    debug(`killing worker "${MessageWorker.id}" `);

    if (MessageWorker.running && retries < 60) {
      debug(`worker "${MessageWorker.id}" is busy, waiting for work completion`);

      await Promise.delay(1000);
      return MessageWorker.kill(retries + 1);
    }

    try {
      const oldKey = MessageProcessorService.getWorkerKey({
        id: MessageWorker.id,
        status: 'alive',
      });

      const newKey = MessageProcessorService.getWorkerKey({
        id: MessageWorker.id,
        status: 'dead',
      });

      debug(`changing worker ${MessageWorker.id} status to "dead"`);
      await redis.renameAsync(oldKey, newKey);
    } catch (err) {
      debug(`failed to change worker ${MessageWorker.id} status to "dead": ${err.meesage}`);
      process.exit(1);
    } finally {
      process.exit(0);
    }
  },

  /**
   * @return {Promise<*|Promise<*>>}
   */
  keepAlive: async () => {
    if (MessageWorker.lastSeen) {
      if (MessageProcessorService.isWorkerDead(MessageWorker)) {
        debug(`not seen for more then 2 minutes, killing worker ${MessageWorker.id}`);
        return MessageWorker.kill();
      }
    }

    try {
      const workerInfo = {
        id: MessageWorker.id || Env.INSTANCE_ID,
        lastSeen: new Date(),
      };

      MessageWorker.id = workerInfo.id;

      debug(`executing keep alive for worker "${workerInfo.id}"`);

      await redis.setAsync(MessageProcessorService.getWorkerKey({
        id: workerInfo.id,
        status: 'alive',
      }), JSON.stringify(workerInfo));

      MessageWorker.lastSeen = workerInfo.lastSeen;

      debug(`successfully executed keep alive for worker "${workerInfo.id}"`);

      await Promise.delay(30000);
    } catch (err) {
      logger.error('Error executing keep alive routine', err);
    } finally {
      await MessageWorker.keepAlive();
    }
  },
};

exports.worker = MessageWorker;

/**
 * @param {String} cronPattern
 * @return {CronJob}
 */
exports.schedule = cronPattern => new CronJob({
  cronTime: cronPattern,
  onTick: MessageWorker.run,
  start: false,
});

/**
 * @return {Promise<void>}
 */
exports.setup = async () => {
  const startupDelay = Math.floor(Math.random() * 5000) + 1000;

  debug(`delaying ${startupDelay} millis...`);
  await Promise.delay(startupDelay);

  debug('configuring new worker');
  await redis.waitForReady();

  const deadWorker = await MessageProcessorService.findDeadWorker();
  const workerHasMessages = deadWorker
    ? await MessageProcessorService.workerHasMessages(deadWorker.id)
    : false;

  if (deadWorker && !workerHasMessages) {
    debug(`found dead worker "${deadWorker.id}" with no messages`);

    debug(`resurrecting worker "${deadWorker.id}"`);
    const key = await MessageProcessorService.getWorkerKeyById(deadWorker.id);

    await MessageProcessorService.removeFromMemory(key);
    debug(`dead worker "${deadWorker.id}" removed from registry`);

    return exports.setup();
  }

  if (deadWorker) {
    logger.info(`Dead worker "${deadWorker.id}" found`);
    try {
      logger.info(`Claiming dead worker "${deadWorker.id}"`);
      await MessageProcessorService.claimWorker(deadWorker.id);
      logger.info(`Successfully claimed worker "${deadWorker.id}"`);
      MessageWorker.id = deadWorker.id;
    } catch (err) {
      logger.error(`Failed claiming dead worker "${deadWorker.id}"`, err);
      return exports.setup();
    }
  }

  if (Env.MESSAGE_PROCESSOR_LIFETIME) {
    debug(`programming worker to die after "${Env.MESSAGE_PROCESSOR_LIFETIME}" millis`);
    setTimeout(MessageWorker.kill, Env.MESSAGE_PROCESSOR_LIFETIME);
  }

  debug('starting keep alive routine');
  MessageWorker.keepAlive()
    .then(() => debug(`worker "${MessageWorker.id}" keep alive routine stopped`))
    .catch(logger.error);
};

process.on('SIGINT', () => {
  debug(`termination routine triggered for worker "${MessageWorker.id}"`);

  MessageWorker.kill();
});
