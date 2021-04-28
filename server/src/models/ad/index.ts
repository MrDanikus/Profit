import mongoose from 'mongoose';

import {toDotNotation} from '../../utils/util';

export type Ad = {
  _id: string;
  name: string;
  description: string;
  link: string;
  vendorId: string;
  tags: string[];
  discount: number;
  promocode: string;
  icon: string;
  likes: number;
  expiresAt: Date;
  createdAt: Date;
  isDeleted: boolean;
};

export type AdDocument = mongoose.Document & Ad;

export type AdModel = mongoose.Model<AdDocument> & {
  /**
   * Finds ad by name
   */
  findByName(name: string): Promise<AdDocument | null>;
  /**
   * Marks ad as deleted
   */
  deleteById(id: string): Promise<AdDocument | null>;
  /**
   * Does a partial update of ad's properties
   */
  patchById(
    id: string,
    patchObject: Partial<
      Omit<Ad, '_id' | 'isDeleted' | 'vendorId' | 'createdAt'>
    >
  ): Promise<AdDocument | null>;
};

const AdSchema = new mongoose.Schema<AdDocument>(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      default: mongoose.Types.ObjectId,
    },
    name: String,
    description: String,
    link: String,
    vendorId: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      ref: 'Vendor',
    },
    tags: [
      {
        type: String,
      },
    ],
    discount: Number,
    promocode: String,
    icon: String,
    likes: {
      type: Number,
      default: 0,
    },
    expiresAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Finds ad by name
 */
AdSchema.statics.findByName = async function (
  name: string
): Promise<AdDocument | null> {
  return await this.findOne({name});
};
/**
 * Marks ad as deleted
 */
AdSchema.statics.deleteById = async function (
  id: string
): Promise<AdDocument | null> {
  return await this.findByIdAndUpdate(
    id,
    {isDeleted: true},
    {
      new: true,
    }
  );
};
/**
 * Does a partial update of ad's properties
 */
AdSchema.statics.patchById = async function (
  id: string,
  patchObject: Partial<Omit<Ad, '_id' | 'isDeleted' | 'vendorId' | 'createdAt'>>
): Promise<AdDocument | null> {
  return await this.findByIdAndUpdate(id, toDotNotation(patchObject), {
    new: true,
  });
};

export const Ads = mongoose.model<AdDocument, AdModel>('Ad', AdSchema);
