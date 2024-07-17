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

  try {
    const apiKey = req.headers['x-api-key'];
  
    const user = await User.findOne({ apiKey });
    if (!user) {
      return next(createHttpError(401, { message: 'Invalid API key' }));
    }

    if (new Date() > user.apiKeyExpiration) {
      return next(createHttpError(401, { message: 'API key has expired' }));
    }

    if (
      user.plan.length > 0 &&
      user.apiUsage > user.plan[0].apiLimit
    ) {
      return next(
        createHttpError(424, { message: "API Usage limit exceeded." })
      );
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(createHttpError(500, { message: error.message }));
  }
};

export default verifyApiKey;
