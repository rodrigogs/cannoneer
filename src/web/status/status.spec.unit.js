/* eslint-disable padded-blocks,import/no-extraneous-dependencies */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const StatusService = require('./status.service');

before(() => {
  chai.use(chaiAsPromised);
  chai.should();
});

describe('StatusService', () => {

  describe('#getUpTime', () => {

    it('should return application up time', async () => {
      const uptime = await StatusService.getUpTime();

      uptime.should.be.a('number');
    });

  });

  describe('#getHostInfo', () => {

    it('should return full application host information', async () => {
      const status = await StatusService.getHostInfo();

      status.should.be.an('object');
    }).timeout(10000); // Windows takes a lot to get host info

  });

  describe('#getStatus', () => {

    it('should return application status', async () => {
      const status = await StatusService.getStatus();

      status.should.be.an('object');
    }).timeout(10000); // Windows takes a lot to get host info

  });

});
