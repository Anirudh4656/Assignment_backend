import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { type IUser, User, UserRole } from "../schemas/User";
import createHttpError from "http-errors";
interface AuthRequest extends Request {
  user?: any;
}
export const roleAuth = (
  roles: UserRole | UserRole[],
  publicRoutes: string[] = []
): any =>
  expressAsyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      
      if (publicRoutes.includes(req.path)) {
        console.log("passed in routes");
        next();
        return;
      }
      let token = req.headers["authorization"]?.replace("Bearer ", "");

      if (!token) {
        throw createHttpError(401, {
          message: `Invalid token`,
        });
      }

     const decodedUser = jwt.verify(token!, process.env.SECRET_KEY!) as IUser;
   const userValue= User.findById(decodedUser._id);
   console.log("in user value:",userValue,decodedUser);
      if (
        decodedUser.role == null ||
        !Object.values(UserRole).includes(decodedUser.role)
      ) {
        throw createHttpError(401, { message: "Invalid user role" });
      }
     
      console.log("in roles include", roles.includes(decodedUser.role));
      // if (!roles.includes(decodedUser.role)) {
      //   console.log("in roles include");
      //   const type =
      //     decodedUser.role.slice(0, 1) +
      //     decodedUser.role.slice(1).toLocaleLowerCase();

      //   throw createHttpError(401, {
      //     message: `${type} can not access this resource`,
      //   });
      // }
      req.user = decodedUser;
      next();
    }
  );
//unused
// console.log("authorization token",token1);
//logic for handling admin portel
//   // Handle the case where the authorization header might be an array
//   if (Array.isArray(token)) {
//     token = token[0];
//   }
//   token = token.replace('Bearer ', '');
//   const token = req.headers["Authorization"]?.replace('Bearer ', '');
