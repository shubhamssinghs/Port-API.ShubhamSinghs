import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { httpStatus, errorMessages, successMessages } from '../constants';
import { emailService } from '../services';

class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.sendEmailVerificationToken =
      this.sendEmailVerificationToken.bind(this);
    this.verifyEmailToken = this.verifyEmailToken.bind(this);
  }

  private generateToken(
    email: string,
    secret: string,
    expiresIn: string | number
  ) {
    return jwt.sign({ email }, secret, { expiresIn });
  }

  private async handleErrors(res: Response, error: unknown, message: string) {
    console.error(message, error);
    res
      .status(httpStatus.InternalServerError)
      .json({ error: errorMessages.InternalServerError });
  }

  public async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.UnprocessableEntity)
        .json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(httpStatus.Conflict).json({
          error: errorMessages.UserAlreadyExist.replace('{{email}}', email)
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: passwordHash });

      res.status(httpStatus.Created).json({
        message: successMessages.UserCreationSuccess
      });
    } catch (error) {
      this.handleErrors(
        res,
        error,
        errorMessages.UnableToCreateUser.replace('{{email}}', email)
      );
    }
  }

  public async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.UnprocessableEntity)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.scope(['withPassword', 'withVerifiedAt']).findOne(
        {
          where: { email }
        }
      );

      if (!user)
        return res.status(httpStatus.NotFound).json({
          error: errorMessages.UserNotFound.replace('{{uuid}}', email)
        });

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword)
        return res
          .status(httpStatus.Unauthorized)
          .json({ error: errorMessages.InvalidEmailOrPassword });

      if (!user.verified_at)
        return res
          .status(httpStatus.Forbidden)
          .json({ error: errorMessages.EmailVerificationRequired });

      const accessToken = this.generateToken(
        user.email,
        config.get('secrets.access_token'),
        config.get('secrets.access_token_expiry')
      );
      const refreshToken = this.generateToken(
        user.email,
        config.get('secrets.refresh_token'),
        config.get('secrets.refresh_token_Expiry')
      );

      res
        .status(httpStatus.OK)
        .cookie('auth-m-rt', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: config.get('secrets.refresh_token_Expiry')
        })
        .json({
          accessToken,
          user: {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            active: user.active,
            img: user.img
          }
        });
    } catch (error) {
      this.handleErrors(res, error, errorMessages.LoginFailed);
    }
  }

  public async logout(req: Request, res: Response) {
    if (!req.cookies || Object.keys(req.cookies).length === 0) {
      return res
        .status(httpStatus.NoContent)
        .json({ error: errorMessages.CookieNotFound });
    }

    res
      .status(httpStatus.OK)
      .clearCookie('auth-m-rt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      .json({ message: successMessages.LogoutSuccess });
  }

  public async refreshToken(req: Request, res: Response) {
    const cookies = req.cookies;
    if (
      !cookies ||
      Object.keys(cookies).length === 0 ||
      !cookies['auth-m-rt']
    ) {
      return res
        .status(httpStatus.Unauthorized)
        .json({ error: errorMessages.CookieNotFound });
    }

    try {
      const { email } = jwt.verify(
        cookies['auth-m-rt'],
        config.get('secrets.refresh_token')
      ) as { email: string };
      const accessToken = this.generateToken(
        email,
        config.get('secrets.access_token'),
        config.get('secrets.access_token_expiry')
      );

      res
        .status(httpStatus.OK)
        .json({ message: successMessages.TokenRefreshSuccess, accessToken });
    } catch (error) {
      this.handleErrors(res, error, errorMessages.TokenRefreshFailed);
    }
  }

  public async sendEmailVerificationToken(req: Request, res: Response) {
    const { email, redirectionUrl } = req.body;

    if (!email)
      return res
        .status(httpStatus.BadRequest)
        .json({ error: errorMessages.InvalidEmail });

    if (!redirectionUrl)
      return res
        .status(httpStatus.BadRequest)
        .json({ error: errorMessages.RedirectUrlRequired });

    try {
      const user = await User.scope('withVerifiedAt').findOne({
        where: { email }
      });

      if (!user)
        return res.status(httpStatus.NotFound).json({
          error: errorMessages.UserNotFound.replace('{{uuid}}', email)
        });

      if (user.verified_at)
        return res
          .status(httpStatus.OK)
          .json({ message: successMessages.EmailAlreadyVerified });

      const token = this.generateToken(
        email,
        config.get('secrets.email_verification_token'),
        config.get('secrets.email_verification_token_expiry')
      );
      user.verification_token = token;
      user.verification_token_expires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await emailService.sendEmail({
        to: email,
        subject: 'Email Verification',
        template: 'email_verify',
        data: { token, redirectionUrl }
      });

      res
        .status(httpStatus.OK)
        .json({ message: successMessages.VerificationEmailSent });
    } catch (error) {
      this.handleErrors(
        res,
        error,
        errorMessages.NotAbleToSendEmailVerificationLink
      );
    }
  }

  public async verifyEmailToken(req: Request, res: Response) {
    const { token } = req.params;

    if (!token)
      return res
        .status(httpStatus.BadRequest)
        .json({ error: errorMessages.TokenNotFound });

    try {
      const emailVerificationSecret = config.get<string>(
        'secrets.email_verification_token'
      );
      const decoded = jwt.verify(token, emailVerificationSecret) as {
        email: string;
      };

      const user = await User.findOne({
        where: { email: decoded.email, verification_token: token }
      });

      if (!user)
        return res
          .status(httpStatus.NotFound)
          .json({ error: errorMessages.TokenNotFound });

      if (
        user.verification_token_expires &&
        new Date() > new Date(user.verification_token_expires)
      )
        return res
          .status(httpStatus.BadRequest)
          .json({ error: errorMessages.TokenExpired });

      user.verified_at = new Date();
      user.verification_token = '';
      user.verification_token_expires = null;

      await user.save();

      const { redirectTo } = req.query;

      if (redirectTo)
        return res.redirect(
          `${redirectTo}?msg=${successMessages.EmailVerifiedSuccessfully}`
        );

      res.status(httpStatus.OK).json({
        message: successMessages.EmailVerifiedSuccessfully
      });
    } catch (error) {
      this.handleErrors(res, error, errorMessages.UnableToVerifyToken);
    }
  }
}

export default new AuthController();
