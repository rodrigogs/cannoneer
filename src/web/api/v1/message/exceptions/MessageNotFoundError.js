class MessageNotFoundError extends Error {
  constructor(id) {
    super('MessageNotFoundError', `Message not found for id "${id}"`);
    this.status = 404;
  }
}

module.exports = MessageNotFoundError;
