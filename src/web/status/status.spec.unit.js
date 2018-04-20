/* eslint-disable padded-blocks,import/no-extraneous-dependencies */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

before(() => {
  chai.use(chaiAsPromised);
  chai.should();
});

describe('StatusService', () => {
});
