class InvalidUpdateFieldError extends Error {
  constructor(field) {
    super('InvalidUpdateFieldError', `Field "${field}" cannot be updated`);
    this.status = 400;
  }
}

module.exports = InvalidUpdateFieldError;
