const debug = require('debuggler')();

debug('initializing application status');

const Status = {
  startupTime: new Date().getTime(),
};

module.exports = Status;
