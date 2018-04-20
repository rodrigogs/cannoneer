const { GQC } = require('graphql-compose');
const UsertTC = require('./user/user.api.v1.schema');
const MessageTC = require('./message');

GQC.rootMutation().addFields({
  message: MessageTC.mutation,
});

module.exports = MessageTC;
