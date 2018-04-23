const debug = require('debuggler');
const Env = require('../config/env');

const badRequest = (ctx, err) => {
  ctx.status = 400;
  ctx.body = { name: err.name, message: err.message };
};

const notFound = (ctx) => {
  ctx.status = 404;
  ctx.body = {
    name: 'NotFoundError',
    message: 'Not Found',
  };
};

const internalError = (ctx, err) => {
  ctx.status = 500;
  ctx.body = { name: err.name, message: err.message };
};

const hanldle = code => ({
  400: badRequest,
  404: notFound,
  500: internalError,
}[code || 500]);

const ErrorMiddleware = () => async (ctx, next) => {
  try {
    await next();
    if (!ctx.status || ctx.status === 404) ctx.throw(404);
  } catch (err) {
    debug(`getting error handler for status "${err.status}"`);
    const handler = hanldle(err.status);

    if (!handler) {
      debug(`error handler not found for status "${err.status}", falling back to Koa error handler`);
      throw err;
    }

    handler(ctx, err);
  }
};

module.exports = ErrorMiddleware;
