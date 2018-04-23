const debug = require('debuggler')();
const Router = require('koa-router');
const ApiSchema = require('./api.v1.schema');
const graphqlHTTP = require('koa-graphql');

const router = new Router();

debug('configuring routes');

const message = require('./message');

router.all('/graphql', graphqlHTTP({
  schema: ApiSchema,
  graphiql: true,
}));

router.use('/message', message.routes(), message.allowedMethods());

module.exports = router;
