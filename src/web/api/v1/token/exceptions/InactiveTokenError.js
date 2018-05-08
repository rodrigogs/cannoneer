class InactiveTokenError extends Error {
  constructor(token) {
    super('InactiveTokenError', `Token "${token}" is inactive.`);
    this.status = 401;
  }
}

module.exports = InactiveTokenError;
