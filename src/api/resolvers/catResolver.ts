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

import mongoose from 'mongoose';
import {Cat} from '../../interfaces/Cat';
import catModel from '../models/catModel';
import {Point} from 'geojson';
import {coordinates} from '../../interfaces/Location';

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
    catsByOwner: async (_parent: undefined, args: {ownerId: string}) => {
      const cats = await catModel.find({owner: args.ownerId});
      if (cats.length === 0) {
        throw new Error('Cat not found');
      }
      return cats;
    },
    catsByArea: async (
      _parent: undefined,
      args: {topRight: coordinates; bottomLeft: coordinates}
    ) => {
      const rightCorner = [args.topRight.lat, args.topRight.lng];
      const leftCorner = [args.bottomLeft.lat, args.bottomLeft.lng];

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
      args: {
        cat_name: String;
        weight: Number;
        birthdate: Date;
        owner: mongoose.Schema.Types.ObjectId;
        location: Point;
        filename: String;
      }
    ): Promise<Cat> => {
      const newCat = await catModel.create({
        cat_name: args.cat_name,
        weight: args.weight,
        birthdate: args.birthdate,
        owner: args.owner,
        location: args.location,
        filename: args.filename,
      });
      if (!newCat) {
        throw new Error('Error creating cat');
      }
      return newCat;
    },
    updateCat: async (
      _parent: undefined,
      args: {
        id: string;
        cat_name?: String;
        weight?: Number;
        birthdate?: Date;
        owner?: mongoose.Schema.Types.ObjectId;
        location?: Point;
        filename: String;
      }
    ): Promise<Cat> => {
      const updatedCat = await catModel.findByIdAndUpdate(
        args.id,
        {
          cat_name: args.cat_name,
          weight: args.weight,
          birthdate: args.birthdate,
          owner: args.owner,
          location: args.location,
          filename: args.filename,
        },
        {
          new: true,
        }
      );
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
