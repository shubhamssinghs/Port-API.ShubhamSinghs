require('dotenv').config();

import { errorMessages, httpStatus } from '../constants';

import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express';

const whitelist = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS error for origin:', origin);
      callback(new Error('CORS Error'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

const handleCorsError = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message.includes('CORS Error')) {
    return res
      .status(httpStatus.Forbidden)
      .json({ error: errorMessages.CORSError });
  }
  next(err);
};

export default { setUpCORS: cors(corsOptions), handleCorsError };
