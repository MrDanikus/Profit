import mongoose from 'mongoose';

export type Comment = {
  _id: string;
  ad: string;
  author: string;
  content: string;
  createdAt: Date;
};

export type CommentDocument = mongoose.Document & Comment;

export type CommentModel = mongoose.Model<CommentDocument> & {
  /**
   * Finds all comments of provided ad
   */
  findByAdId(ad: string): Promise<CommentDocument[]>;
  /**
   * Builds new comment with given attributes
   */
  build(
    author: string,
    ad: string,
    attr: Pick<Comment, 'content'>
  ): CommentDocument;
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
    ad: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      ref: 'Ad',
    },
    author: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      ref: 'User',
    },
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
  ad: string
): Promise<CommentDocument[]> {
  return await this.find({ad});
};

/**
 * Builds new comment with given attributes
 */
CommentSchema.statics.build = function (
  author: string,
  ad: string,
  attr: Pick<Comment, 'content'>
): CommentDocument {
  return new Comments({author, ad, ...attr});
};

export const Comments = mongoose.model<CommentDocument, CommentModel>(
  'Comment',
  CommentSchema
);
