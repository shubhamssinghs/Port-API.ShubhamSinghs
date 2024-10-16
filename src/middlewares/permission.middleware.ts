import { Permissions } from '../enums/permissions.enum';
// import { User } from '../models';
import { Request, Response, NextFunction } from 'express';

// import { Permissions } from '../enums/permissions.enum';

export const checkPermissions = () => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      //   const user = res.locals.user;

      //   if (user.type === 'admin') {
      //     return next();
      //   }

      //   const foundUser = await User.scope('withPermissions').findByPk(user.id);

      next();

      //   if (!foundUser) {
      //     return res.status(404).json({ message: 'User not found' });
      //   }

      //   const userPermissions = foundUser.Permissions.map(
      //     (permission) => permission.name
      //   );

      //   if (userPermissions.includes(requiredPermission)) {
      //     return next();
      //   }

      //   return res.status(403).json({
      //     message:
      //       'Forbidden: You do not have permission to access this resource.'
      //   });
    } catch (error) {
      console.error('Error checking permissions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const addDefaultUserPermission = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.defaultPermission = [
    { name: Permissions.VIEW_OWN_PROFILE },
    { name: Permissions.DELETE_OWN_PROFILE },
    { name: Permissions.UPDATE_OWN_PROFILE }
  ];

  console.log('here', res.locals);

  next();
};
