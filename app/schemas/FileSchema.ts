import { Schema, model, Document } from 'mongoose';

export interface IFile extends Document {
  user: Schema.Types.ObjectId;
  filename: string;
  filepath: string;
  isPublic: boolean;
}

const fileSchema = new Schema<IFile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: false },
  filepath: { type: String, required: false },
  isPublic: { type: Boolean, default: false },
});

export const File = model<IFile>('File', fileSchema);
