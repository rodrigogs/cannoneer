class ExpiredTokenError extends Error {
  constructor(token) {
    super(`Token "${token}" is expired.`);
    this.name = 'ExpiredTokenError';
    this.status = 401;
  }
}

module.exports = ExpiredTokenError;
