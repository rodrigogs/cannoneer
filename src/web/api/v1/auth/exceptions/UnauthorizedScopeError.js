class UnauthorizedScopeError extends Error {
  constructor(type, scope) {
    super('UnauthorizedScopeError', `Unauthorized scope: ${type}:${scope}.`);
    this.status = 401;
  }
}

module.exports = UnauthorizedScopeError;
