const Env = require('./config/env');
const _ = require('lodash');

const contexts = Env.CONTEXTS.split(',');
const apps = [];

if (_.includes(contexts, 'server') || Env.CONTEXTS === 'all') {
  apps.push({
    name: 'server',
    script: './bin/www',
    instances: Env.SERVER_CORES,
    exec_mode: 'cluster',
    watch: true,
    env: {
      CONTEXT: 'server',
    },
  });
}

if (_.includes(contexts, 'message-worker') || Env.CONTEXTS === 'all') {
  apps.push({
    name: 'message-worker',
    script: './bin/workers',
    instances: Env.MESSAGE_PROCESSOR_CORES,
    exec_mode: 'cluster',
    watch: true,
    env: {
      CONTEXT: 'message-worker',
    },
  });
}

module.exports = apps;
