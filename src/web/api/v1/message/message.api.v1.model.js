const Ajv = require('ajv');

const ajv = new Ajv();

const MessageModel = ajv.compile({
  title: 'Message',
  type: 'object',
  properties: {
    destinations: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    method: {
      type: 'string',
    },
    headers: {
      type: 'object',
    },
    payload: {
      type: ['number', 'string', 'object', 'array', 'boolean', 'null'],
    },
    expected: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
        },
        body: {
          type: ['number', 'string', 'object', 'array', 'boolean', 'null'],
        },
      },
    },
  },
  required: [
    'destinations',
    'method',
  ],
});

module.exports = MessageModel;
