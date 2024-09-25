import { Sequelize, Model } from 'sequelize';
import { sequelize } from '../database';

class RolePermissions extends Model {
  public static initialize(sequelize: Sequelize): void {
    this.init(
      {},
      {
        sequelize,
        modelName: 'role_permissions',
        tableName: 'role_permissions',
        timestamps: false,
        underscored: true
      }
    );
  }
}

RolePermissions.initialize(sequelize);

export default RolePermissions;
