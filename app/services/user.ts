import { User, IUser, UserRole } from "../schemas/User";
import bcrypt from "bcrypt";
export const createUser = async (data: {
    email: string;
    role: UserRole;
    password: string;
  }) => {
    const user = await User.create({ ...data, active: true });
    return user;
  };
  //again
  export const updateUser = async (userId: string, data: Partial<IUser>) => {
    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      new: true,
      projection: "-password",
    });
    return user;
  };
  
  export const deleteUser = async (userId: string) => {
    const user = await User.deleteOne({ _id: userId });
    return user;
  };
  
  export const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email: email }).lean();
    return user;
  };
  
  export const getUserById = async (id: string) => {
    const user = await User.findById(id).lean();
    return user;
  };
  
  export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  };