class InvalidTokenError extends Error {
  constructor(token) {
    super('InvalidTokenError', `Token "${token}" is invalid.`);
    this.status = 401;
  }
}

module.exports = InvalidTokenError;
