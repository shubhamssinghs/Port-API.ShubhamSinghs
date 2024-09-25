import Log from './log.model';
import User from './user.model';
import Role from './role.model';
import Permission from './permission.model';
import RolePermissions from './role-permissions.model';

Role.associate({ User, Permission });
Permission.associate({ Role });
User.associate({ Role });

export { Log, User, Role, Permission, RolePermissions };
