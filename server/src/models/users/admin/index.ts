import mongoose from 'mongoose';

import {BaseUser, BaseUserDocument, BaseUserSchema} from '../base';
import {Role} from '../role';

export type Admin = BaseUser & {role: Role.VENDOR};
export type AdminDocument = BaseUserDocument & Admin;

export type AdminModel = mongoose.Model<AdminDocument> & {
  findByLogin(login: string): Promise<AdminDocument>;
};

export const AdminSchema = BaseUserSchema;

export const Admins = mongoose.model<AdminDocument, AdminModel>(
  'Admin',
  AdminSchema
);
