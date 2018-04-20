const debug = require('debuggler')();
const Router = require('koa-router');
const StatusController = require('./status.controller');

const router = new Router();

debug('configuring routes');

router.get('/', StatusController.get);

module.exports = router;
