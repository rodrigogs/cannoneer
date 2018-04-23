const debug = require('debuggler')();
const Router = require('koa-router');
const UserController = require('./user.api.v1.controller');

const router = new Router();

debug('configuring routes');

router.get('/', UserController.get);

module.exports = router;
