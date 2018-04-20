const User = require('./user.api.v1.model');
const { composeWithMongoose } = require('graphql-compose-mongoose/node8');

const customizationOptions = {};
const UserTC = composeWithMongoose(User, customizationOptions);

const Schema = {
  query: {
    userById: UserTC.getResolver('findById'),
    userByIds: UserTC.getResolver('findByIds'),
    userOne: UserTC.getResolver('findOne'),
    userMany: UserTC.getResolver('findMany'),
    userCount: UserTC.getResolver('count'),
    userPagination: UserTC.getResolver('pagination'),
  },
  mutation: {
    userCreate: UserTC.getResolver('createOne'),
    userUpdateById: UserTC.getResolver('updateById'),
    userUpdateOne: UserTC.getResolver('updateOne'),
    userUpdateMany: UserTC.getResolver('updateMany'),
    userRemoveById: UserTC.getResolver('removeById'),
    userRemoveOne: UserTC.getResolver('removeOne'),
    userRemoveMany: UserTC.getResolver('removeMany'),
  },
};

module.exports = Schema;
