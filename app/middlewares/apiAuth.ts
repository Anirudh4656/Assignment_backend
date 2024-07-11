import { Request, Response, NextFunction } from 'express';
import { type IUser, UserRole } from "../schemas/User";
import createHttpError from "http-errors";
import {User} from "../schemas/User"
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: any;
}
const apiAuth = async (req:AuthRequest, res: Response, next: NextFunction) => {
  let token = req.headers["authorization"]?.replace("Bearer ", "");
    // if (!apiKey) return res.status(401).json({ message: 'No API key, authorization denied' });
  
    // try {
    //   const user = await User.findOne({ apiKey });
    //   if (!user || user.isBlocked) return res.status(401).json({ message: 'Invalid or blocked API key' });
    //   req.user = user;
    //   next();
    // } catch (err) {
    // //   res.status(500).json({ error: err.message });
    // }
    if (!token) {
      throw createHttpError(401, {
        message: `Invalid token`,
      });
    }
    const decodedUser = jwt.verify(token!, "dghfghghjghjghjghj"!) as IUser;
  
   const user = await User.findById(decodedUser.id).select('-password');

    console.log("decode check middleware", user?.apiKey);
    if(! user?.apiKey){
     throw createHttpError(401, {
    message: `Api Key Expired`,
  });
    }
    next();
  };
  
  export default apiAuth;