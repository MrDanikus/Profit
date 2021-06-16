import mongoose from 'mongoose';
import config from 'config';

import {IDatabase} from '../interfaces';

import {staticImplements} from '../../utils/util';
import logger from '../../utils/logger';

@staticImplements<IDatabase>()
export class MongoDatabase {
  /**
   * Establish connection with the database
   */
  static async connect(): Promise<void> {
    mongoose.SchemaTypes.ObjectId.get(v => (v ? v.toString() : v));
    try {
      await mongoose.connect(config.get('mongo.link'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });

      logger.info('mongodb succesfully connected');
    } catch (err) {
      logger.error(`mongodb connection failed: ${err.message}`);
      throw err;
    }
  }
}
