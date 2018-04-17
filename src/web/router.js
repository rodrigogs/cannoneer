const debug = require('debuggler')();
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const api = require('./api');

router.use('/api', api.routes(), api.allowedMethods());

module.exports = router;
