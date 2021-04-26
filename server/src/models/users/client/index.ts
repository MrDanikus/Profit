import mongoose from 'mongoose';

import {BaseUser, BaseUserDocument, BaseUserSchema} from '../base';
import {Role} from '../role';

export type Client = BaseUser & {role: Role.CLIENT};
export type ClientDocument = BaseUserDocument & Client;

export type ClientModel = mongoose.Model<ClientDocument> & {
  findByLogin(login: string): Promise<ClientDocument>;
};

export const ClientSchema = Object.assign({}, BaseUserSchema);

export const Clients = mongoose.model<ClientDocument, ClientModel>(
  'Client',
  ClientSchema
);
