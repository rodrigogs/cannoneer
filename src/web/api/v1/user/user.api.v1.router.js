const debug = require('debuggler')();
const Router = require('koa-router');
const UserController = require('./user.api.v1.controller');

const router = new Router();

debug('configuring routes');

router.post('/', UserController.create);
router.get('/:id', UserController.get);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.disable);

module.exports = router;
