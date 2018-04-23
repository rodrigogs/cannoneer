const debug = require('debuggler')();
const Router = require('koa-router');
const RoleController = require('./role.api.v1.controller');

const router = new Router();

debug('configuring routes');

router.get('/', RoleController.get);

module.exports = router;
