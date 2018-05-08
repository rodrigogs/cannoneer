class UnauthorizedError extends Error {
  constructor() {
    super('UnauthorizedError', 'Unauthorized.');
    this.status = 401;
  }
}

module.exports = UnauthorizedError;
