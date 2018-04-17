const debug = require('debuggler')();
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const v1 = require('./v1');

router.use('/', v1.routes(), v1.allowedMethods());

module.exports = router;
