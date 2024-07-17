import mongoose, { Types, Schema } from "mongoose";
import { type BaseSchema } from "./index";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IPlan, Plan } from "./PlanSchema";
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
export interface IUser extends BaseSchema {
  user: string;
  id: string;
  save(): unknown;
  username: string;
  email: string;
  password: string;
  isBlocked: boolean;
  role: UserRole;
  apiUsage: number;
  storageUsage: number;
  apiKey: string;
  apiKeyExpiration: Date;
  plan: IPlan[];
  publicSecret: string;
}

//uppercase error 2)userrole passs  ?
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: UserRole, default: UserRole.USER },
  apiUsage: { type: Number, default: 0 },
  storageUsage: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  plan: [{ type: Schema.Types.ObjectId, ref: "Plan" }],
  apiKeyExpiration: { type: Date },
  apiKey: {
    type: String,
  },
  publicSecret: {
    type: String,
    default: () => crypto.randomBytes(20).toString("hex"),
  },
});

UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
export const User = mongoose.model("User", UserSchema);
