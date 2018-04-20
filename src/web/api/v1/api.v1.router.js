const debug = require('debuggler')();
const Router = require('koa-router');
const ApiSchema = require('./api.v1.schema');
const graphqlHTTP = require('koa-graphql');

const router = new Router();

debug('configuring routes');

router.all('/', graphqlHTTP({
  schema: ApiSchema,
  graphiql: true,
}));

module.exports = router;
