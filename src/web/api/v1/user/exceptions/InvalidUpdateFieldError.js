class InvalidUpdateFieldError extends Error {
  constructor(field) {
    super(`Field "${field}" cannot be updated`);
    this.status = 400;
  }
}

module.exports = InvalidUpdateFieldError;
