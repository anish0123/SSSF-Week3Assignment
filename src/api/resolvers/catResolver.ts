// TODO: Add resolvers for cat
// 1. Queries
// 1.1. cats
// 1.2. catById
// 1.3. catsByOwner
// 1.4. catsByArea
// 2. Mutations
// 2.1. createCat
// 2.2. updateCat
// 2.3. deleteCat

import {Cat} from '../../interfaces/Cat';
import catModel from '../models/catModel';

export default {
  Query: {
    cats: async () => {
      return await catModel.find();
    },
    catById: async (_parent: undefined, args: {id: string}) => {
      const cat = await catModel.findById(args.id);
      if (!cat) {
        throw new Error('Cat not found');
      }
      return cat;
    },
    catsByOwner: async (_parent: undefined, args: {owner: string}) => {
      const cats = await catModel.find({owner: args.owner});
      if (cats.length === 0) {
        throw new Error('Cat not found');
      }
      return cats;
    },
    catsByArea: async (
      _parent: undefined,
      args: {topRight: string; bottomLeft: string}
    ) => {
      const rightCorner = args.topRight.split(',');
      const leftCorner = args.bottomLeft.split(',');

      const cats = await catModel.find({
        location: {
          $geoWithin: {
            $box: [leftCorner, rightCorner],
          },
        },
      });
      if (cats.length === 0) {
        throw new Error('Cat not found');
      }
      return cats;
    },
  },
  Mutation: {
    createCat: async (
      _parent: undefined,
      args: {cat: Omit<Cat, '_id'>}
    ): Promise<Cat> => {
      const newCat = await catModel.create(args.cat);
      if (!newCat) {
        throw new Error('Error creating cat');
      }
      return newCat;
    },
    updateCat: async (
      _parent: undefined,
      args: {id: string; cat: Omit<Cat, '_id'>}
    ): Promise<Cat> => {
      const updatedCat = await catModel.findByIdAndUpdate(args.id, args.cat, {
        new: true,
      });
      if (!updatedCat) {
        throw new Error('Cat not found');
      }
      return updatedCat;
    },
    deleteCat: async (_parent: undefined, args: {id: string}): Promise<Cat> => {
      const deletedCat = await catModel.findByIdAndDelete(args.id);
      if (!deletedCat) {
        throw new Error('Cat not found');
      }
      return deletedCat;
    },
  },
};
