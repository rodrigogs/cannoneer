const debug = require('debuggler')();
const Router = require('koa-router');
const Env = require('../../../../config/env');
const AuthMiddleware = require('./auth/auth.api.v1.middleware');

const router = new Router();

debug('configuring routes');

const AuthRouter = require('./auth');
const UserRouter = require('./user');
const MessageRouter = require('./message');

router.use('/auth', AuthRouter.routes(), AuthRouter.allowedMethods());

// Ensure authentication for the following routes
router.use(AuthMiddleware.authenticate());

router.use(
  '/user',
  AuthMiddleware.grant('user'),
  UserRouter.routes(), UserRouter.allowedMethods(),
);

router.use(
  '/message',
  AuthMiddleware.grant('message'),
  MessageRouter.routes(), MessageRouter.allowedMethods(),
);

module.exports = router;
