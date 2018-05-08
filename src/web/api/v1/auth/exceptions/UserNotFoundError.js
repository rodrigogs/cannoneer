class UserNotFoundError extends Error {
  constructor(token) {
    super('UserNotFoundError', `User not found for token "${token}".`);
    this.status = 401;
  }
}

module.exports = UserNotFoundError;
