const debug = require('debuggler')();
const Router = require('koa-router');
// const ApiSchema = require('./api.v1.schema');
// const graphqlHTTP = require('koa-graphql');

const router = new Router();

debug('configuring routes');

const auth = require('./auth');
const role = require('./role');
const user = require('./user');
const userRole = require('./userRole');
const message = require('./message');

// router.all('/graphql', graphqlHTTP({
//   schema: ApiSchema,
//   graphiql: true,
// }));

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/role', role.routes(), role.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/userRole', userRole.routes(), userRole.allowedMethods());
router.use('/message', message.routes(), message.allowedMethods());

module.exports = router;
