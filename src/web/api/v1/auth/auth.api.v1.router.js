const debug = require('debuggler')();
const Router = require('koa-router');
const AuthController = require('./auth.api.v1.controller');

const router = new Router();

debug('configuring routes');

router.get('/', AuthController.get);

module.exports = router;
