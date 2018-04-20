const debug = require('debuggler')();
const Router = require('koa-router');
const UserRoleController = require('./userRole.api.v1.controller');

const router = new Router();

debug('configuring routes');

router.get('/', UserRoleController.get);

module.exports = router;
