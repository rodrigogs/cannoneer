const debug = require('debuggler');
const Env = require('../config/env');

const notFound = (ctx) => {
  ctx.status = 404;
  ctx.body = {
    message: 'Not Found',
  };
};

const internalError = (ctx, err) => {
  if (Env.NODE_ENV === 'production') delete err.stack;

  ctx.status = 500;
  ctx.body = err;
};

const hanldle = code => ({
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
