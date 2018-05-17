const debug = require('debuggler')();
const redis = require('../../../config/redis');
const logger = require('../../../config/logger');
const MessageService = require('../../web/api/v1/message/message.api.v1.service');

const ONE_MINUTE = 60 * 1000;

const normalizeWorker = (worker) => {
  worker = JSON.parse(worker);
  worker.lastSeen = new Date(worker.lastSeen);
  return worker;
};

const MessageWorkerService = {
  /**
   * status: ['alive', 'dead']
   *
   * @param {String} [id = '*']
   * @param {String} [status = '*'] Instance status
   * @return {string}
   */
  getWorkerKey: ({ id = '*', status = '*' } = {}) => {
    return `msgwrkr:instance:${id}:${status}`;
  },

  getWorkerKeyById: async (id) => {
    const keyPattern = MessageWorkerService.getWorkerKey({ id });
    const [key] = await redis.keysAsync(keyPattern);

    return key;
  },

  getAllWorkers: () => {
    debug('retrieving all workers');
    return redis
      .keysAsync(MessageWorkerService.getWorkerKey())
      .map(key => redis.getAsync(key))
      .map(normalizeWorker);
  },

  getDeadWorkers: () => {
    debug('retrieving dead workers');
    return redis
      .keysAsync(MessageWorkerService.getWorkerKey({ status: 'dead' }))
      .map(key => redis.getAsync(key))
      .map(normalizeWorker);
  },

  findDeadWorker: async () => {
    debug('looking for dead workers');
    let deadWorkers = await MessageWorkerService.getDeadWorkers();

    if (deadWorkers.length) {
      debug(`${deadWorkers.length} dead workers found`);
      return deadWorkers.reduce((acc, curr) => {
        return (acc.lastSeen.getTime() > curr.lastSeen.getTime()) ? acc : curr;
      });
    }

    debug('no dead workers found, assuming keep alive strategy');
    deadWorkers = await MessageWorkerService.getAllWorkers()
      .filter(MessageWorkerService.isWorkerDead);

    if (deadWorkers.length) {
      debug(`${deadWorkers.length} dead workers found through keep alive strategy`);
      return deadWorkers.reduce((acc, curr) => {
        return (acc.lastSeen.getTime() > curr.lastSeen.getTime()) ? acc : curr;
      });
    }
  },

  workerHasMessages: async (id) => {
    if (!id) return false;

    const keyPattern = MessageService.getMessageKey({ worker: id });
    const keys = await redis.keysAsync(keyPattern);
    return keys > 0;
  },

  /**
   * @param {String} id Worker id
   * @param {Number} timeout
   * @return {Promise<void>}
   */
  claimWorker: async (id, timeout = 30000) => {
    const [originalKey] = await redis
      .keysAsync(MessageWorkerService.getWorkerKey({ id }));

    const claimingKey = MessageWorkerService.getWorkerKey({
      id,
      status: 'claiming',
    });

    const newKey = MessageWorkerService.getWorkerKey({
      id,
      status: 'alive',
    });

    redis.renameAsync(originalKey, claimingKey);

    const timeSalt = Math.floor(Math.random() * 10000) + 5000;
    await Promise.delay(timeout + timeSalt);

    if (!await redis.getAsync(claimingKey)) {
      throw new Error(`Could not claim worker "${id}". Another worker already assumed the job.`);
    }

    return redis.renameAsync(claimingKey, newKey);
  },

  notSeenFor: (lastSeen, maxMillis) => {
    return (new Date().getTime() - lastSeen.getTime()) > maxMillis;
  },

  isWorkerDead: (worker) => {
    return MessageWorkerService.notSeenFor(worker.lastSeen, ONE_MINUTE * 2);
  },

  /**
   * @param key
   * @param attempt
   * @return {Promise<*|Promise<*>>}
   */
  removeFromMemory: async (key, attempt = 0) => {
    try {
      debug(`removing key "${key}" from redis`);
      await redis.delAsync(key);
    } catch (err) {
      const retryIn = Math.min(attempt * 100, 60000);

      logger.error(`Failed to remove key "${key}" from redis`, err);
      logger.info(`Retrying in ${retryIn / 1000} seconds...`);

      await Promise.delay(retryIn);

      return MessageWorkerService.removeFromMemory(key, attempt + 1);
    }
  },

  /**
   * @param {String} workerId Worker id
   * @param {Number} page
   * @param {Number} limit
   * @return {Promise<Object>}
   */
  getPaginatedMessages: async (workerId, page = 0, limit = 10) => {
    const messageQuery = MessageService.getMessageKey({ worker: workerId });

    debug(`retrieving paginated messages for worker "${workerId}"`);
    const [cursor, keys] = await redis
      .scanAsync(String(page), 'MATCH', messageQuery, 'COUNT', String(limit));

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
  processMessages: async (workerId, cursor = 0) => {
    const { cursor: next, messages: page } = await MessageWorkerService
      .getPaginatedMessages(workerId, cursor);

    try {
      await Promise.each(page, async (message) => {
        const {
          id,
          url,
          key,
        } = message;

        try {
          debug(`delivering message "${id}" using worker "${workerId}"`);

          await MessageService.deliverMessage(id, url, message);
          await MessageWorkerService.removeFromMemory(key);
        } catch (err) {
          logger.error(`Failed to deliver message "${id}" with error:`, err.message);
        }
      });
    } finally {
      if (next !== '0') {
        await MessageWorkerService.processMessages(workerId, next);
      }
    }
  },
};

module.exports = MessageWorkerService;
