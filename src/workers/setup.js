const debug = require('debuggler')();
const Env = require('../../config/env');

debug('configuring workers');

const MessageProcessor = require('./processors/message');

const workers = [];

if (Env.MESSAGE_PROCESSOR_CRON) {
  debug(`scheduling ${MessageProcessor.worker.name} worker with cron '${Env.LOCALE_PROCESSOR_CRON}'`);

  workers.push({
    worker: MessageProcessor.worker,
    job: MessageProcessor.schedule(Env.MESSAGE_PROCESSOR_CRON),
  });
}

module.exports = workers;
