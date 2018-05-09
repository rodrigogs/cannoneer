const debug = require('debuggler')();
const UserRole = require('./userRole.api.v1.model');
const Role = require('../role/role.api.v1.model');

const UserRoleService = {
  /**
   * @param {String} method
   * @return {String}
   */
  getMethodUserRoleType: method => ({
    GET: 'R',
    PUT: 'W',
    POST: 'W',
    DELETE: 'W',
  })[method],

  /**
   * @param {Object} user
   * @param {String} roleRef
   * @param {String} roleType
   * @return {Promise<Boolean>}
   */
  hasRole: async (user, roleRef, roleType) => {
    debug(`retrieving roles for user "${user._id}"`);

    const role = await Role.findOne({ ref: roleRef }).exec();
    const userRole = await UserRole
      .findOne({ user, role, type: { $regex: roleType } })
      .populate('role')
      .exec();

    return !!userRole;
  },
};

module.exports = UserRoleService;
