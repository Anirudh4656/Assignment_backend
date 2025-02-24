import { Schema, model, Document } from 'mongoose';

export interface IFile extends Document {
  user: Schema.Types.ObjectId;
  filename: string;
  filepath: string;
  isPublic: boolean;
  filesize:number;
  createdAt: Date;
  updatedAt: Date;
  _id:any;
  publicSecret?:string;
}

const fileSchema = new Schema<IFile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  filesize: { type: Number, required: true },
  filepath: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  publicSecret:{type:String,default:false}
},
  { timestamps: true }
);

export const File = model<IFile>('File', fileSchema);
