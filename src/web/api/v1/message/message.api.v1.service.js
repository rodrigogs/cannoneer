const debug = require('debuggler')();
const MessageSchema = require('./message.api.v1.model');
const redis = require('../../../../../config/redis');
const { CronJob } = require('cron');
const { ObjectId } = require('mongoose').Types;

const schedules = {};

const MessageService = {
  send: async (data) => {
    MessageSchema.validate(data);

    const id = new ObjectId();

  },
};

module.exports = MessageService;
