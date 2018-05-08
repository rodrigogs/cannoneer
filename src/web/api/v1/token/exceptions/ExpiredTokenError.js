class ExpiredTokenError extends Error {
  constructor(token) {
    super('ExpiredTokenError', `Token "${token}" is expired.`);
    this.status = 401;
  }
}

module.exports = ExpiredTokenError;
