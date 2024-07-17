// middleware/verifyApiKey.js
import { User } from "../schemas/User";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
const verifyApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = req.user;
  console.log("api key verify", result);
  if (!result) {
    throw createHttpError(401, { message: "Unauthorized" });
  }
  try {
    const userDetails = await User.findById(result.id).populate({
      path: "plan",
    });
    if (!userDetails) {
      throw createHttpError(401, { message: "No details Found" });
    }
    if (!userDetails.apiKey) {
      return next(createHttpError(404, { message: "API key is missing." }));
    }
    if (
      userDetails.plan.length > 0 &&
      userDetails.apiUsage > userDetails.plan[0].apiLimit
    ) {
      return next(
        createHttpError(429, { message: "API Usage limit exceeded." })
      );
    }

    req.user = userDetails;
    next();
  } catch (error: any) {
    next(createHttpError(500, { message: error.message }));
  }
};

export default verifyApiKey;
