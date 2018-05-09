const debug = require('debuggler')();
const Router = require('koa-router');
const MessageController = require('./message.api.v1.controller');
const AuthMiddleware = require('../auth/auth.api.v1.middleware');
const MessageRoles = require('./message.api.v1.roles');

const router = new Router();

debug('configuring routes');

router.get('/:id', AuthMiddleware(MessageRoles.MESSAGE_STATUS), MessageController.status);
router.delete('/:id', AuthMiddleware(MessageRoles.MESSAGE_CANCEL), MessageController.cancel);
router.post('/', AuthMiddleware(MessageRoles.MESSAGE_SEND), MessageController.send);

module.exports = router;
