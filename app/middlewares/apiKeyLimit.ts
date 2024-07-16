import { Request, Response, NextFunction } from "express";
import { User, type IUser } from "../schemas/User";
import createHttpError from "http-errors";
import rateLimit from "express-rate-limit";
const apiKeyLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = req.user;

    if (!result) {
      throw createHttpError(401, { message: "Unauthorized" });
    }
    // console.log("in apiKeyLimit :", result);
    const userDetails = await User.findById(result.id).populate({
      path: "plan",
    });
   
    //204
    if (!userDetails) {
      throw createHttpError(401, { message: "No details Found" });
    }
    console.log("in userDetils before:", userDetails);
    userDetails.apiUsage += 1;
    await userDetails.save();

    if (userDetails.plan.length === 0) {
      return next(createHttpError(404, { message: "No plan available." }));
    }

    const apiRequestperSecond = userDetails?.plan[0].apiLimit;
    const limiter = rateLimit({
      windowMs: 1000, //1sec
      max: apiRequestperSecond, // limit each IP to 5 requests per windowMs
      message:
        "Too many requests from this IP, please try again after a second",
      headers: true,
      handler: (req, res, next, options) => {
        //why
        return next(
          createHttpError(options.statusCode, { message: options.message })
        );
      },
    });
    limiter(req, res, async (err) => {
      if (err) {
        next(createHttpError(404, { message: "Key not found" }));
        next(err);
      }
    });

    if (!userDetails.apiKey) {
      return next(createHttpError(404, { message: "API key is missing." }));
    }
   const apiUsage =2;
     const apiLimit =2
    if (userDetails.apiUsage > userDetails.plan[0].apiLimit) {
      return next(
        createHttpError(429, { message: "API Usage limit exceeded." })
      );
    }
    console.log("in userDetils after", userDetails);
   
   

    // //what happen if plan expires
  
    if (
      userDetails &&
      result.storageUsage >=
        userDetails?.plan[0].storageLimit * 1024 * 1024 * 1024
    ) {
      throw createHttpError(404, { message: "Memory limit exceeded." });
    }
   
    
    next();
  } catch (error: any) {
    next(createHttpError(500, { message: error.message }));
  }
};

export default apiKeyLimit;
