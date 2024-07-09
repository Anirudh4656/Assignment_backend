import { Request, Response, NextFunction } from 'express';
import {User,type IUser} from '../schemas/User';
import createHttpError from "http-errors";

const apiKeyLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = "668d3bd2848c982f8fab7c45"; // Assuming you attach user ID to request in authentication middleware
    console.log("in apikey Limit:",userId);
        if (!userId) {
          throw createHttpError(401, { message: 'Unauthorized' });
        }
    
        const user = await User.findById(userId).populate({
            path:'plan' }
        );
        console.log("in apikey Limit:",user,"user field");
    //check api key h ya  nhi error 
        if (!user ) {
          throw createHttpError(404, { message: 'User not found' });
        }
        if (!user.apiKey ) {
            throw createHttpError(404, { message: 'Key not found' });
          }

        if (user.apiUsage >= user.plan[0].apiLimit){
          throw createHttpError(403, { message: 'API Usage limit exceeded.' });
        }
    
        user.apiUsage += 1;
        await user.save();
        next();
      } catch (error) {
        next(createHttpError(500, { message: 'Internal Server Error.' }));
      }
  next();
};

export default apiKeyLimit;
//upload ->check plan h ya nhi->apikey h ya nhi ya apikey limit exxceed to nhi ho gye  
//storage exceed to nhi ho gyaa