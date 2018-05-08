class InvalidMessageSchemaError extends Error {
  constructor(errors) {
    errors = errors.map((err) => {
      return `[${err.keyword} validation] at "${err.dataPath}" ${err.message}`;
    });

    super('InvalidMessageSchemaError', errors.join(', '));
    this.status = 400;
  }
}

module.exports = InvalidMessageSchemaError;
