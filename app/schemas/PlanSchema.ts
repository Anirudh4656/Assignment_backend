import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  apiLimit: number;
  storageLimit: number;
  domainLimit: number;
  apiLimitPerSecond: number;
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  apiLimit: { type: Number, required: true },
  storageLimit: { type: Number, required: true },
  domainLimit: { type: Number, required: true },
  apiLimitPerSecond: { type: Number, required: true },
});

export const Plan = model<IPlan>('Plan', planSchema);
