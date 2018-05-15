const debug = require('debuggler');
const logger = require('../../config/logger');

const badRequest = (ctx, err) => {
  ctx.status = 400;
  ctx.body = {
    name: err.name || 'BadRequestError',
    message: err.message || 'Bad Request',
  };
};

const unauthorized = (ctx, err) => {
  ctx.status = 401;
  ctx.body = {
    name: err.name || 'Unauthorized',
    message: err.message || 'Unauthorized',
  };
};

const notFound = (ctx, err) => {
  ctx.status = 404;
  ctx.body = {
    name: err.name || 'NotFoundError',
    message: err.message || 'Not Found',
  };
};

const internalError = (ctx, err) => {
  logger.error(err);

  ctx.status = 500;
  ctx.body = {
    name: err.name || 'InternalError',
    message: err.message || 'Internal Error',
  };
};

const hanldle = code => ({
  400: badRequest,
  401: unauthorized,
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
