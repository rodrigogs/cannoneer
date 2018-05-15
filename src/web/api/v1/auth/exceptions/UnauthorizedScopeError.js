class UnauthorizedScopeError extends Error {
  constructor(type, scope) {
    super(`Unauthorized scope: ${type}:${scope}.`);
    this.name = 'UnauthorizedScopeError';
    this.status = 401;
  }
}

module.exports = UnauthorizedScopeError;
