const debug = require('debuggler')();
const UserRole = require('./userRole.api.v1.model');

const UserRoleService = {
  /**
   * @param {Object} user
   * @return {Promise<Role>}
   */
  getRole: async (user) => {
    const { role } = await UserRole
      .findOne({ user })
      .populate('role')
      .exec();

    return role;
  },
};

module.exports = UserRoleService;
