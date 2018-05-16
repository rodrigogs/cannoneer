class InvalidScopeError extends Error {
  constructor(scope) {
    super(`Scope "${scope}" is invalid.`);
    this.name = 'InvalidScopeError';
    this.status = 400;
  }
}

module.exports = InvalidScopeError;
