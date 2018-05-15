class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized.');
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

module.exports = UnauthorizedError;
