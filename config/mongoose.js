const debug = require('debuggler')();
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const Env = require('./env');
const Promise = require('./promise');
const logger = require('./logger');

debug(`configuring mongoose connection to ${Env.MONGO_URL}`);

mongoose.promise = Promise;

mongoose.set('debug', Env.NODE_ENV === 'development');

mongoose.connection.on('open', () => logger.info('Mongoose default connection is open'));

mongoose.connection.on('connected', () => logger.info(`Mongoose default connection open to ${Env.MONGO_URL}`));

mongoose.connection.on('error', err => logger.error(`Mongoose default connection error: ${err}`));

mongoose.connection.on('disconnected', () => logger.info('Mongoose default connection disconnected'));

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = () => {
  mongoose.plugin(beautifyUnique);
  return mongoose.connect(Env.MONGO_URL, { reconnectTries: Number.MAX_VALUE });
};
