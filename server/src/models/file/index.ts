import mongoose from 'mongoose';

export type File = {
  _id: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
};

export type FileDocument = mongoose.Document<File> & File;

export type FileModel = mongoose.Model<FileDocument> & {
  /**
   * Builds new file
   *
   * @param attr attributes
   */
  build(attr: Omit<File, '_id' | 'createdAt'>): FileDocument;
};

const FileSchema = new mongoose.Schema<FileDocument, FileModel>(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      get: (val: mongoose.Types.ObjectId) => {
        return val ? val.toString() : val;
      },
      default: mongoose.Types.ObjectId,
    },
    contentType: String,
    data: Buffer,
    size: Number,
  },
  {
    id: false,
    timestamps: true,
  }
);

FileSchema.statics.build = function (
  attr: Omit<File, '_id' | 'createdAt'>
): FileDocument {
  return new Files(attr);
};

export const Files = mongoose.model<FileDocument, FileModel>(
  'File',
  FileSchema
);
