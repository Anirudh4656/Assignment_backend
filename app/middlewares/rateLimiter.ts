import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import createHttpError from 'http-errors';
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 1, // limit each IP to 1 request per windowMs
    message: "Too many requests from this IP, please try again after a second",
    headers: true,
    handler: (req, res, next, options) => {
      return next(createHttpError(options.statusCode, { message: options.message }));
    },
  });
  export default limiter;