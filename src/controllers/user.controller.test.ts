import request from 'supertest';
import express, { Application } from 'express';

import { userController } from '../controllers';
import { User } from '../models';
import { errorMessages, httpStatus } from '../constants';

jest.mock('../models/user.model');

const app: Application = express();

describe('User Controller', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('/api/user/all', () => {
    const allUserRoute = '/api/user/all';
    app.get(allUserRoute, userController.getAllUsers);

    it('should return all users successfully', async () => {
      const mockUsers = [
        {
          uuid: '9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df',
          name: 'Test User',
          email: 'test@test.com',
          img: null,
          active: true,
          created_at: '2024-05-20 11:09:44',
          updated_at: '2024-05-21 09:24:10'
        },
        {
          uuid: 'f350a813-f298-496b-81e7-2f53ca7ed6e2',
          name: 'Test User',
          email: 'test1@test.com',
          img: null,
          active: true,
          created_at: '2024-05-22 05:54:17',
          updated_at: '2024-05-22 05:54:17'
        }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get(allUserRoute);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.users).toEqual(mockUsers);
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when trying to fetch all users', async () => {
      const error = new Error(errorMessages.InternalServerError);
      (User.findAll as jest.Mock).mockRejectedValue(error);

      const response = await request(app).get(allUserRoute);

      expect(response.status).toBe(httpStatus.InternalServerError);
      expect(response.body.error).toEqual(errorMessages.InternalServerError);
      expect(User.findAll).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('/api/user/:uuid', () => {
    const userByUuidRoute = '/api/user/:uuid?';
    app.get(userByUuidRoute, userController.getUserByUuid);

    it('should return a user using uuid', async () => {
      const mockUser = {
        uuid: '9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df',
        name: 'Test User',
        email: 'test@test.com',
        img: null,
        active: true,
        created_at: '2024-05-20 11:09:44',
        updated_at: '2024-05-21 09:24:10'
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get(
        '/api/user/9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df'
      );

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.user).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledTimes(1);
    });

    it('should return error with status code 422 if uuid is missing', async () => {
      const response = await request(app).get('/api/user/');

      expect(response.status).toBe(httpStatus.UnprocessableEntity);
      expect(response.body.error).toEqual(errorMessages.InvalidUuid);
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return error with status code 404 if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/user/abcd');

      expect(response.status).toBe(httpStatus.NotFound);
      expect(response.body.error).toEqual(
        errorMessages.UserNotFound.replace('{{uuid}}', 'abcd')
      );
      expect(User.findByPk as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when trying to fetch user by uuid', async () => {
      const error = new Error(errorMessages.InternalServerError);
      (User.findByPk as jest.Mock).mockRejectedValue(error);

      const response = await request(app).get(
        '/api/user/9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df'
      );

      expect(response.status).toBe(httpStatus.InternalServerError);
      expect(response.body.error).toEqual(errorMessages.InternalServerError);
      expect(User.findByPk).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  // describe('/api/user/:uuid/update', () => {
  //   const updateUserRoute = '/api/user/:uuid?/update';
  //   app.put(updateUserRoute, userController.updateUser);

  //   it('should update the user name, email, and img', async () => {
  //     const mockCurrentUser = {
  //       uuid: '9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df',
  //       name: 'Test User',
  //       email: 'test@test.com',
  //       img: null,
  //       active: true,
  //       created_at: '2024-05-20 11:09:44',
  //       updated_at: '2024-05-21 09:24:10'
  //     };

  //     (User.findByPk as jest.Mock).mockResolvedValue(mockCurrentUser);

  //     const updatedData = {
  //       name: 'User',
  //       email: '1@test.com',
  //       img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAoUlEQVR4AWP4DwcMDBgwYJgYGBiYmBgAAOrIINkCkZGRkYGBgYGBgYGBgYGJiYmBiYmBgYGBgYGBg4GBoAAmM5F9g2yFB8AAAAASUVORK5CYII='
  //     };

  //     const response = await request(app)
  //       .put('/api/user/9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df/update')
  //       .send(updatedData);

  //     console.log(response);

  //     const expectedUpdatedUser = {
  //       ...mockCurrentUser,
  //       name: updatedData.name,
  //       email: updatedData.email,
  //       img: updatedData.img
  //     };

  //     expect(response.status).toBe(httpStatus.OK);
  //     expect(response.body.message).toBe(successMessages.UserUpdateSuccess);
  //     expect(response.body.user).toEqual(expectedUpdatedUser);
  //     expect(User.findByPk).toHaveBeenCalledTimes(1);
  //   });
  // });
});
