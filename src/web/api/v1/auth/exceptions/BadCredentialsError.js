class BadCredentialsError extends Error {
  constructor(message = 'Invalid username or password.') {
    super(message);
    this.name = 'BadCredentialsError';
    this.status = 401;
  }
}

module.exports = BadCredentialsError;
