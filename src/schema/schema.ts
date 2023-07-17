import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } from 'graphql';
import UserModel from '../models/user.model';
import MessageModel from '../models/message.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserType: any = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    messages: {
      type: new GraphQLList(MessageType),
      resolve(parent, args) {
        return MessageModel.find({ user: parent._id });
      },
    },
    recipients: {
      type: new GraphQLList(MessageType),
      resolve(parent, args) {
        return MessageModel.find({ recipients: parent.recipients });
      },
    },
  }),
});

const MessageType: any = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return UserModel.findById(parent.user);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return UserModel.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return UserModel.findById(args.id);
      },
    },
    messages: {
      type: new GraphQLList(MessageType),
      resolve(parent, args) {
        return MessageModel.find();
      },
    },
    message: {
      type: MessageType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return MessageModel.findById(args.id);
      },
    },
    previousMessages: {
      type: new GraphQLList(MessageType),
      args: { user: { type: GraphQLID } },
      resolve(parent, args) {
        return MessageModel.find({ user: args.user });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = new UserModel({
          name: args.name,
          email: args.email,
          password: hashedPassword,
          messages: args.messages
        });
        await user.save();
        return user;
      },
    },
    addMessage: {
      type: MessageType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: {type: new GraphQLNonNull(GraphQLID)},
        recipientId: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: async (parent, args) => {
        const message = new MessageModel({
          content: args.content,
          user: args.userId,
        });
        const savedMessgae = await message.save();

        //updating user's messages array
        await UserModel.findByIdAndUpdate(
        args.userId,
        {$push: {messages: savedMessgae._id}},
        {new: true});

        //updating recipient's messages array
        await UserModel.findByIdAndUpdate(
        args.recipientId,
        {$push: {recipients: savedMessgae._id}},
        {new: true});
        
        return savedMessgae;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
