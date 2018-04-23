const debug = require('debuggler')();
const Router = require('koa-router');
const MessageController = require('./message.api.v1.controller');

const router = new Router();

debug('configuring routes');

router.get('/:id', MessageController.status);
router.delete('/:id', MessageController.cancel);
router.post('/', MessageController.send);

module.exports = router;
