const Ajv = require('ajv');
const JsonSchemaFilter = require('json-schema-filter');

const JSONUtil = {
  /**
   * @param {Object} schema JSON schema
   * @return {Function}
   */
  validate: (schema) => {
    const ajv = new Ajv();
    const validator = ajv.compile(schema);

    /**
     * @param {Object} data
     * @return {null|Object[]}
     */
    return (data) => {
      const valid = validator(data);
      if (valid) return null;

      return validator.errors;
    };
  },

  /**
   * @param {Object} schema JSON schema
   * @return {Function}
   */
  normalize: (schema) => {
    /**
     * @param {Object} data
     * @return {Object}
     */
    return data => JsonSchemaFilter(schema, data);
  },
};

module.exports = JSONUtil;
