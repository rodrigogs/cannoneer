// const os = require('os');
const Env = require('./config/env');
const _ = require('lodash');

const contexts = Env.CONTEXTS.split(',');
const apps = [];

if (_.includes(contexts, 'web') || Env.CONTEXTS === 'all') {
  apps.push({
    name: 'web',
    script: './bin/www',
    // instances: Env.SERVER_CORES || os.cpus().length,
    exec_mode: 'cluster',
    watch: true,
    env: {
      CONTEXT: 'web',
    },
  });
}

if (_.includes(contexts, 'message-worker') || Env.CONTEXTS === 'all') {
  apps.push({
    name: 'message-worker',
    script: './bin/workers',
    // instances: Env.MESSAGE_PROCESSOR_CORES || os.cpus().length,
    exec_mode: 'cluster',
    watch: true,
    env: {
      CONTEXT: 'message-worker',
    },
  });
}

module.exports = apps;
