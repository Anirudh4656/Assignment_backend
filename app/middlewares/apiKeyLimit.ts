import { Request, Response, NextFunction } from "express";
import { User, type IUser } from "../schemas/User";
import createHttpError from "http-errors";
import rateLimit from "express-rate-limit";
const getRateLimiter = (apiRequestperSecond: number) =>
  rateLimit({
    windowMs: 1000, // 1 second
    max: apiRequestperSecond, // limit each IP to apiRequestperSecond requests per windowMs
    message: "Too many requests from this IP, please try again after a second",
    headers: true,
    handler: (req, res, next, options) => {
      return next(
        createHttpError(options.statusCode, { message: options.message })
      );
    },
  });

const apiKeyLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = req.user;
    console.log("result  in apikeyLimit", result);
    if (!result) {
      throw createHttpError(401, { message: "Unauthorized" });
    }
    if (result.plan.length === 0) {
      return next(createHttpError(404, { message: "No plans available." }));
    }
    const apiRequestperSecond = result?.plan[0].apiLimit;
    const limiter = getRateLimiter(apiRequestperSecond);

    limiter(req, res, async (err) => {
      if (err) {
        next(createHttpError(429, { message: "Too many requests from this IP, please try again after a second" }));
        next(err);
      }
    });

    if (
      result.storageUsage >=
      result?.plan[0].storageLimit * 1024 * 1024 * 1024
    ) {
      throw createHttpError(404, { message: "Memory limit exceeded." });
    }
    console.log("user is saving", result);

    result.apiUsage += 1;
    await result.save();
    console.log("user is saving", result);
    next();
  } catch (error: any) {
    next(createHttpError(500, { message: error.message }));
  }
};

export default apiKeyLimit;
