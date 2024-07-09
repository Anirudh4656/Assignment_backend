import { Request, Response, NextFunction } from 'express';
import {User} from "../schemas/User";
const apiAuth = async (req: Request, res: Response, next: NextFunction) => {
    // const apiKey = req.header('x-api-key');
    // if (!apiKey) return res.status(401).json({ message: 'No API key, authorization denied' });
  
    // try {
    //   const user = await User.findOne({ apiKey });
    //   if (!user || user.isBlocked) return res.status(401).json({ message: 'Invalid or blocked API key' });
    //   req.user = user;
    //   next();
    // } catch (err) {
    // //   res.status(500).json({ error: err.message });
    // }
  };
  
  export default apiAuth;