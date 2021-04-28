import mongoose from 'mongoose';

export type Comment = {
  _id: string;
  adId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
};

export type CommentDocument = mongoose.Document & Comment;

export type CommentModel = mongoose.Model<CommentDocument> & {
  /**
   * Finds all comments of provided ad
   */
  findByAdId(adId: string): Promise<CommentDocument[]>;
};

const CommentSchema = new mongoose.Schema<CommentDocument, CommentModel>(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      default: mongoose.Types.ObjectId,
    },
    adId: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      ref: 'Ad',
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      ref: 'User',
    },
    authorName: String,
    content: String,
  },
  {
    timestamps: true,
  }
);

/**
 * Finds comments by ad's id
 */
CommentSchema.statics.findByLogin = async function (
  adId: string
): Promise<CommentDocument[]> {
  return await this.find({adId});
};

export const Comments = mongoose.model<CommentDocument, CommentModel>(
  'Comment',
  CommentSchema
);
