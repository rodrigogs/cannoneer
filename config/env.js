const path = require('path');
const { ObjectId } = require('mongoose').Types;

const INSTANCE_ID = new ObjectId();

/**
* @see https://github.com/motdotla/dotenv#usage
*/
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env.test') });
} if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env') });
}

/**
 * @class Env
 */
class Env {
  /**
   * Application context.
   *
   * @default 'development'
   * @return {String}
   */
  static get NODE_ENV() {
    return (process.env.NODE_ENV || 'development');
  }

  /**
   * Application port.
   *
   * @default 3000
   * @return {Number}
   */
  static get PORT() {
    return process.env.PORT ? Number(process.env.PORT) : 3000;
  }

  /**
   * Application's context.
   *
   * 'all' enables all contexts
   * 'web' enables http server
   * 'message-worker' enables MessageWorker
   *
   * @default 'all'
   * @return {String}
   */
  static get CONTEXTS() {
    return process.env.CONTEXTS || 'all';
  }

  /**
   * HTTP log config.
   *
   * @see https://github.com/expressjs/morgan#predefined-formats
   * @default 'dev'
   * @return {String}
   */
  static get HTTP_LOG_CONFIG() {
    return process.env.HTTP_LOG_CONFIG || 'dev';
  }

  /**
   * Redis connection string.
   *
   * @see http://www.iana.org/assignments/uri-schemes/prov/redis
   * @default 'redis://localhost:6379'
   * @return {String}
   */
  static get REDIS_URL() {
    return process.env.REDIS_URL || 'redis://localhost:6379';
  }

  /**
   * Redis connection string.
   *
   * @see https://www.iana.org/assignments/uri-schemes/prov/mongodb
   * @default 'mongodb://localhost:27017/cannoneer'
   * @return {String}
   */
  static get MONGO_URL() {
    return process.env.MONGO_URL || 'mongodb://localhost:27017/cannoneer';
  }

  /**
   * @default 1
   * @return {Number}
   */
  static get SERVER_INSTANCES() {
    return Number.isNaN(process.env.SERVER_INSTANCES)
      ? 0
      : Number(process.env.SERVER_INSTANCES);
  }

  /**
   * @return {String}
   */
  static get MESSAGE_PROCESSOR_CRON() {
    return process.env.MESSAGE_PROCESSOR_CRON;
  }

  /**
   * @default 1
   * @return {Number}
   */
  static get MESSAGE_PROCESSOR_INSTANCES() {
    return Number.isNaN(process.env.MESSAGE_PROCESSOR_INSTANCES)
      ? 0
      : Number(process.env.MESSAGE_PROCESSOR_INSTANCES);
  }

  /**
   * Message processor lifetime in millis.
   *
   * @default null
   * @return {Number}
   */
  static get MESSAGE_PROCESSOR_LIFETIME() {
    return Number.isNaN(process.env.MESSAGE_PROCESSOR_LIFETIME)
      ? null
      : Number(process.env.MESSAGE_PROCESSOR_LIFETIME);
  }

  /**
   * @return {String}
   */
  static get INSTANCE_ID() {
    return process.env.INSTANCE_ID || INSTANCE_ID;
  }

  /**
   * @return {boolean}
   */
  static get AUTH_ENABLED() {
    return String(process.env.AUTH_ENABLED).toUpperCase() === 'TRUE';
  }
}

module.exports = Env;
