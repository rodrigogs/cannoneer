const MessageService = require('./message.api.v1.service');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLUnionType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLScalarType,
} = require('graphql');

const PayloadUnionType = new GraphQLNonNull(new GraphQLUnionType({
  name: 'PayloadUnionType',
  description: 'Message payload',
  types: [
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLScalarType,
    GraphQLObjectType,
  ],
  resolveType: (value) => {
    if (value instanceof GraphQLString) return GraphQLString;
    if (value instanceof GraphQLList) return GraphQLList;
    if (value instanceof GraphQLBoolean) return GraphQLBoolean;
    if (value instanceof GraphQLFloat) return GraphQLFloat;
    if (value instanceof GraphQLInt) return GraphQLInt;
    if (value instanceof GraphQLScalarType) return GraphQLScalarType;
    if (value instanceof GraphQLObjectType) return GraphQLObjectType;
  },
}));

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: '...',
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  description: '...',
  fields: {
    send: {
      type: GraphQLString,
      args: {
        destinations: GraphQLList,
        method: new GraphQLNonNull(GraphQLString),
        headers: GraphQLObjectType,
        payload: PayloadUnionType,
        expected: GraphQLObjectType,
      },
      resolve: async (root, {
        destinations,
        headers,
        method,
        payload,
        expected,
      }) => {
        const data = {
          destinations,
          headers,
          method,
          payload,
          expected,
        };
        return MessageService.send(data);
      },
    },
    cancel: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: GraphQLString,
        },
      },
    },
  },
});

const MessageController = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

module.exports = MessageController;
