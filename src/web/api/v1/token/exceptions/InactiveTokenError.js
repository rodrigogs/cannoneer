class InactiveTokenError extends Error {
  constructor(token) {
    super(`Token "${token}" is inactive.`);
    this.name = 'InactiveTokenError';
    this.status = 401;
  }
}

module.exports = InactiveTokenError;
