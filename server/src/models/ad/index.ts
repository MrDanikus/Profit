import mongoose from 'mongoose';

import {toDotNotation} from '../../utils/util';

type Icon = {
  /* in base64 format */
  data: string;
  contentType: string;
};

export type Ad = {
  _id: string;
  name: string;
  description: string;
  link: string;
  vendor: string;
  tags: string[];
  discount: number;
  promocode: string;
  icon: Icon;
  likes: number;
  expiresAt: Date;
  createdAt: Date;
  isDeleted: boolean;
};

export type AdDocument = mongoose.Document & Ad;

export type AdModel = mongoose.Model<AdDocument> & {
  /**
   * Increase like count of ad
   */
  likeById(id: string): Promise<void>;
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
      Omit<Ad, '_id' | 'isDeleted' | 'vendor' | 'createdAt' | 'likes'>
    >
  ): Promise<AdDocument | null>;
  /**
   * Builds new ad with given attributes
   */
  build(
    vendor: string,
    attr: Omit<Ad, '_id' | 'isDeleted' | 'vendor' | 'createdAt' | 'likes'>
  ): AdDocument;
};

const AdSchema = new mongoose.Schema<AdDocument, AdModel>(
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
    vendor: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      ref: 'User',
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

AdSchema.index(
  {
    name: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    weights: {
      name: 2,
      description: 1,
      tags: 1,
    },
    default_language: 'en',
  }
);
AdSchema.index({
  vendor: -1,
  tags: 1,
  createdAt: 1,
  likes: 1,
  isDeleted: -1,
  expiresAt: -1,
});

/**
 * Builds new ad with given attributes
 */
AdSchema.statics.build = function (
  vendor: string,
  attr: Omit<Ad, '_id' | 'isDeleted' | 'vendor' | 'createdAt' | 'likes'>
): AdDocument {
  return new Ads({vendor, ...attr});
};
/**
 * Increase like count of ad
 */
AdSchema.statics.likeById = async function (
  id: string
): Promise<AdDocument | null> {
  return await this.findByIdAndUpdate(
    id,
    {
      $inc: {
        likes: 1,
      },
    },
    {
      new: true,
    }
  );
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
