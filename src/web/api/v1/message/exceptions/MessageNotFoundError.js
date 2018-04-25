class MessageNotFoundError extends Error {
  constructor(id) {
    super(`Message not found for id "${id}"`);
    this.name = 'MessageNotFoundError';
    this.status = 404;
  }
}

module.exports = MessageNotFoundError;
