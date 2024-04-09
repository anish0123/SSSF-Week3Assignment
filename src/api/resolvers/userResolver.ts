import {Cat} from '../../interfaces/Cat';
import {User} from '../../interfaces/User';
import userModel from '../models/userModel';

export default {
  Cat: {
    owner: async (parent: Cat): Promise<User> => {
      const user = await userModel.findById(parent.owner);
      if (!user) {
        throw new Error('Owner not found');
      }
      return user;
    },
  },
  Query: {
    users: async () => {
      return await userModel.find();
    },
    userById: async (_parent: undefined, args: {id: string}) => {
      const user = await userModel.findById(args.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
  },
  Mutation: {
    createUser: async (
      _parent: undefined,
      args: {user_name: string; email: string}
    ) => {
      const newUser = await userModel.create({
        user_name: args.user_name,
        email: args.email,
      });
      if (!newUser) {
        throw new Error('Error creating user');
      }
      return newUser;
    },
    updateUser: async (
      _parent: undefined,
      args: {id: string; user_name?: string; email?: string}
    ) => {
      const updatedUser = await userModel.findByIdAndUpdate(
        args.id,
        {
          user_name: args.user_name,
          email: args.email,
        },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    },
    deleteUser: async (_parent: undefined, args: {id: string}) => {
      const deletedUser = await userModel.findByIdAndDelete(args.id);
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return deletedUser;
    },
  },
};
