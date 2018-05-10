const debug = require('debuggler')();
const Router = require('koa-router');
const AuthMiddleware = require('./auth/auth.api.v1.middleware');
// const ApiSchema = require('./api.v1.schema');
// const graphqlHTTP = require('koa-graphql');

const router = new Router();

debug('configuring routes');

const AuthRouter = require('./auth');
const UserRouter = require('./user');
const MessageRouter = require('./message');

router.use('/auth')
  .use(AuthRouter.routes(), AuthRouter.allowedMethods());

// router.all('/graphql', graphqlHTTP({
//   schema: ApiSchema,
//   graphiql: true,
// }));

router.use(AuthMiddleware.authenticate());

router.use('/user')
  .use(AuthMiddleware.grant('user'))
  .use(UserRouter.routes(), UserRouter.allowedMethods());

router.use('/message')
  .use(AuthMiddleware.grant('message'))
  .use(MessageRouter.routes(), MessageRouter.allowedMethods());

module.exports = router;
