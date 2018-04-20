const si = require('systeminformation');
const { Env, status } = require('../../../config');
const pkg = require('../../../package');

const StatusService = {
  /**
   * @return {Promise<{uptime, host: *}>}
   */
  getStatus: async () => ({
    name: pkg.name,
    version: pkg.version,
    uptime: StatusService.getUpTime(),
    context: Env.NODE_ENV,
    host: await StatusService.getHostInfo(),
  }),

  /**
   * @return {Number}
   */
  getUpTime: () => new Date().getTime() - status.startupTime,

  /**
   * @return {Promise<{time: *, system: *, cpu: *, memory: *,
   * os: {info: *, version: *}, disks: *, networkInterfaces: *}>}
   */
  getHostInfo: async () => ({
    time: await si.time(),
    system: await si.system(),
    cpu: await si.cpu(),
    memory: await si.mem(),
    os: {
      info: await si.osInfo(),
      version: await si.versions(),
    },
    disks: await si.fsSize(),
    networkInterfaces: await si.networkInterfaces(),
  }),
};

module.exports = StatusService;
