const {
  logger,
  redis,
  mongoose,
  Env,
} = require('../../config');
const debug = require('debuggler')();
const Koa = require('koa');
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const session = require('koa-session');
const errorMiddleware = require('./error.middleware');

/**
 * Bootstraps Koa application.
 *
 * @return {Promise<Koa>}
 */
const bootstrap = async () => {
  debug('bootstrapping application');

  const app = new Koa();

  app.use(errorMiddleware());
  app.use(helmet());
  app.use(cors());
  app.use(morgan(Env.HTTP_LOG_CONFIG, { stream: logger.stream }));

  app.keys = [Env.SESSION_SECRET];
  app.use(session({}, app));

  app.use(bodyParser({
    jsonLimit: '10mb',
  }));

  await redis.waitForReady();
  await mongoose();

  const router = require('./router');
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

module.exports = bootstrap;
