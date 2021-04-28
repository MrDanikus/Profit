import mongoose from 'mongoose';

import {BaseUser, BaseUserDocument, BaseUserSchema} from '../base';
import {Role} from '../role';

export type Vendor = BaseUser & {role: Role.VENDOR};
export type VendorDocument = BaseUserDocument & Vendor;

export type VendorModel = mongoose.Model<VendorDocument> & {
  findByLogin(login: string): Promise<VendorDocument>;
};

export const VendorSchema = BaseUserSchema;

export const Vendors = mongoose.model<VendorDocument, VendorModel>(
  'Vendor',
  VendorSchema
);
