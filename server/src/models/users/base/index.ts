import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import {Role} from '../role';

export type BaseUser = {
  _id: string;
  name: string;
  login: string;
  password: string | null;
  likes: string[];
  createdAt: Date;
  role: Role;
};

export type BaseUserDocument = mongoose.Document &
  BaseUser & {
    password: null;
    /**
     * Compares partner password and provided one
     */
    comparePassword(password: string): boolean;
  };

export const BaseUserSchema = new mongoose.Schema<BaseUserDocument>(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      default: mongoose.Types.ObjectId,
    },
    name: String,
    login: {
      type: String,
      unique: true,
      required: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      get: () => {
        return null;
      },
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        get: (val: mongoose.Types.ObjectId) => {
          return val ? val.toString() : val;
        },
        ref: 'Ad',
      },
    ],
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.CLIENT,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compares user's password and provided one
 */
BaseUserSchema.methods.comparePassword = function (password: string) {
  console.log(this.collection.name);
  return bcrypt.compareSync(
    password,
    this.get('password', null, {getters: false})
  );
};
/**
 * Finds user by login
 */
BaseUserSchema.statics.findByLogin = async function (
  login: string
): Promise<BaseUserDocument | null> {
  return await this.findOne({login});
};
