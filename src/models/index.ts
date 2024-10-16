import Log from './log.model';
import User from './user.model';
import Permission from './permission.modal';

User.belongsToMany(Permission, {
  through: 'user_permissions',
  foreignKey: 'user_uuid',
  otherKey: 'permission_uuid'
});

Permission.belongsToMany(User, {
  through: 'user_permissions',
  foreignKey: 'permission_uuid',
  otherKey: 'user_uuid'
});

export { Log, User, Permission };
