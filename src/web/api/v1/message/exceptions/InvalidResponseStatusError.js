class InvalidResponseStatusError extends Error {
  constructor(expected, status) {
    super(`Expecting status ${expected}, found ${status}`);
    this.name = 'InvalidResponseStatusError';
    this.status = 400;
  }
}

module.exports = InvalidResponseStatusError;
