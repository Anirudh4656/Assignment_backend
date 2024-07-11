import { Request, Response, NextFunction } from 'express';
import {User,type IUser} from '../schemas/User';
import createHttpError from "http-errors";
import rateLimit from 'express-rate-limit';
const apiKeyLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result =req.users
    //     console.log("in api auth :",result)
    // console.log("in apikey Limit:",user);
    //     if (!userId) {
    //       throw createHttpError(401, { message: 'Unauthorized' });
    //     }
    
    //     const user = await User.findById(userId).populate({
    //         path:'plan' }
    //     );
    //     const apiRequestperSecond= user?.plan[0].apiLimit
        
    //    const limiter= rateLimit({
    //       windowMs: apiRequestperSecond, // 1 second window
    //       max: 5, // limit each IP to 5 requests per windowMs
    //       message: 'Too many requests from this IP, please try again after a second',
    //       headers: true,
    //       handler: (req, res, next, options) => {
    //         //why
    //         return next ( createHttpError(options.statusCode, { message: options.message }));
           
    //       }
    //     });
    //     limiter(req, res, async (err) => {
    //       if (err) {
    //         return next(err);
    //       } })
    //     console.log("in apikey Limit:",user,"user field");
    // //check api key h ya  nhi error 
    //     if (!user ) {
    //       return next( createHttpError(404, { message: 'User not found' }));
    //     }
    //     if (!user.apiKey ) {
    //       return next(  createHttpError(404, { message: 'Key not found' }));
    //       }

    //     if (user.apiUsage >= user.plan[0].apiLimit){
    //       return next( createHttpError(403, { message: 'API Usage limit exceeded.' }));
    //     }
    // //what happen if plan expires
    //     user.apiUsage += 1;
    //     const userPlanLimit=user.plan[0].storageLimit
    //     if(user. storageUsage >= userPlanLimit*1024 * 1024 * 1024 ){
    //       throw createHttpError(403, { message: 'Memory limit exceeded.' });
    //     }
    //     await user.save();
    //     next();
       
      } catch (error:any) {
        next(createHttpError(500, { message: error.message }));
      }
 
};

export default apiKeyLimit;
//upload ->check plan h ya nhi->apikey h ya nhi ya apikey limit exxceed to nhi ho gye  
//storage exceed to nhi ho gyaa