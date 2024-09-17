import config from 'config';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

import { httpStatus, errorMessages } from '../constants';

interface JwtPayload {
  uuid: string;
  name: string;
  email: string;
}

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 login request per `window` per minute
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable ht `X-RateLimit-*` headers
  handler: (_req, res, _next, options) => {
    res.sendStatus(options.statusCode);
  }
});

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    (req.headers['authorization'] as string) ||
    (req.headers['Authorization'] as string);

  if (!authHeader)
    return res
      .status(httpStatus.Forbidden)
      .json({ error: errorMessages.MissingAuthorizationHeader });

  const token = authHeader && authHeader.split(' ')[1];

  if (token === null)
    return res
      .status(httpStatus.Unauthorized)
      .json({ error: errorMessages.TokenNotProvided });

  const accessTokenSecret = config.get<string>('secrets.access_token');

  jwt.verify(
    token,
    accessTokenSecret,
    (err: VerifyErrors | null, decoded: unknown) => {
      if (err) {
        console.error(errorMessages.TokenVerificationFailed, err);
        return res
          .status(httpStatus.Forbidden)
          .json({ error: errorMessages.TokenVerificationFailed });
      }

      const user = decoded as JwtPayload;
      if (!user) {
        return res
          .status(httpStatus.Forbidden)
          .json({ error: errorMessages.TokenVerificationFailed });
      }

      res.locals.user = user;
      next();
    }
  );
};
