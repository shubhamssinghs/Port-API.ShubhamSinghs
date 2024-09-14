import { Request, Response } from 'express';

import { User } from '../models';
import { httpStatus, errorMessages, successMessages } from '../constants';

class UserController {
  constructor() {
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserByUuid = this.getUserByUuid.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  private handleErrors(res: Response, error: unknown, message: string) {
    console.error(message, error);
    res
      .status(httpStatus.InternalServerError)
      .json({ error: errorMessages.InternalServerError });
  }

  public async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.status(httpStatus.OK).json({ users });
    } catch (error) {
      this.handleErrors(
        res,
        error,
        errorMessages.NotAbleToRetrievingData.replace('{{data}}', 'users')
      );
    }
  }

  public async getUserByUuid(req: Request, res: Response) {
    const { uuid } = req.params;
    if (!uuid)
      return res
        .status(httpStatus.UnprocessableEntity)
        .json({ error: errorMessages.InvalidUuid });

    try {
      const user = await User.findByPk(uuid);
      if (!user)
        return res.status(httpStatus.NotFound).json({
          error: errorMessages.UserNotFound.replace('{{uuid}}', uuid)
        });
      res.status(httpStatus.OK).json({ user });
    } catch (error) {
      this.handleErrors(
        res,
        error,
        errorMessages.NotAbleToRetrievingData.replace('{{data}}', 'user')
      );
    }
  }

  public async updateUser(req: Request, res: Response) {
    const { uuid } = req.params;

    if (!uuid)
      return res
        .status(httpStatus.UnprocessableEntity)
        .json({ error: errorMessages.InvalidUuid });

    try {
      const user = await User.findByPk(uuid);
      if (!user)
        return res.status(httpStatus.NotFound).json({
          error: errorMessages.UserNotFound.replace('{{uuid}}', uuid)
        });

      const { name, email, img } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;

      if (img) {
        const base64Regex = /^data:image\/([a-zA-Z]*);base64,([^\s]*)$/;
        if (!base64Regex.test(img)) {
          return res.status(httpStatus.BadRequest).json({
            error: errorMessages.InvalidBase64
          });
        }
        user.img = img;
      }

      await user.save();

      res
        .status(httpStatus.OK)
        .json({ message: successMessages.UserUpdateSuccess, user });
    } catch (error) {
      this.handleErrors(res, error, errorMessages.UserUpdateFailed);
    }
  }

  public async deleteUser(req: Request, res: Response) {
    const { uuid } = req.params;
    if (!uuid)
      return res
        .status(httpStatus.UnprocessableEntity)
        .json({ error: errorMessages.InvalidUuid });

    try {
      const user = await User.findByPk(uuid);
      if (!user)
        return res.status(httpStatus.NotFound).json({
          error: errorMessages.UserNotFound.replace('{{uuid}}', uuid)
        });

      await user.destroy();

      res
        .status(httpStatus.OK)
        .json({ message: successMessages.UserDeletedSuccessfully });
    } catch (error) {
      this.handleErrors(res, error, errorMessages.UserDeleteFailed);
    }
  }
}

export default new UserController();
