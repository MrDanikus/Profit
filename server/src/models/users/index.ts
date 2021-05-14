import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import {Role} from './role';

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

export type Client = BaseUser & {role: Role.CLIENT};
export type Vendor = BaseUser & {role: Role.VENDOR};
export type Admin = BaseUser & {role: Role.ADMIN};

export type ClientDocument = BaseUserDocument & Client;
export type VendorDocument = BaseUserDocument & Vendor;
export type AdminDocument = BaseUserDocument & Admin;

export type BaseUserModel = mongoose.Model<BaseUserDocument> & {
  findByLogin(login: string): Promise<BaseUserDocument>;
};

export const UserSchema = new mongoose.Schema<BaseUserDocument, BaseUserModel>(
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
    id: false,
    timestamps: true,
  }
);

/**
 * Compares user's password and provided one
 */
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(
    password,
    this.get('password', null, {getters: false})
  );
};
/**
 * Finds user by login
 */
UserSchema.statics.findByLogin = async function (
  login: string
): Promise<BaseUserDocument | null> {
  return await this.findOne({login});
};

export const Users = mongoose.model<BaseUserDocument, BaseUserModel>(
  'User',
  UserSchema
);
