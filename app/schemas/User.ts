import mongoose, { Types } from "mongoose";
import { type BaseSchema } from "./index";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

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
  role: UserRole;
  isBlocked: boolean;
}

//uppercase error 2)userrole passs  ?
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: UserRole, default: UserRole.USER },
  isBlocked: { type: Boolean, default: false },
});

UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
export const User = mongoose.model("User", UserSchema);
