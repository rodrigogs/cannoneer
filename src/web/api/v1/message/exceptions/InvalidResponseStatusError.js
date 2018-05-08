class InvalidResponseStatusError extends Error {
  constructor(expected, status) {
    super('InvalidResponseStatusError', `Expecting status ${expected}, found ${status}`);
  }
}

module.exports = InvalidResponseStatusError;
