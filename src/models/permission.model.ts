import { Sequelize, Model, DataTypes } from 'sequelize';

import { sequelize } from '../database';
import Role from './role.model';

interface PermissionAttributes {
  uuid?: string;
  name: string;
}

class Permission extends Model<PermissionAttributes> {
  public uuid!: string;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    this.init(
      {
        uuid: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'permission',
        tableName: 'permissions',
        timestamps: true,
        underscored: true
      }
    );
  }

  public static associate(models: { Role: typeof Role }): void {
    this.belongsToMany(models.Role, {
      through: 'RolePermissions',
      as: 'roles',
      foreignKey: 'permissionId'
    });
  }

  public static applyScopes(): void {
    this.addScope('defaultScope', {
      order: [['createdAt', 'DESC']]
    });
  }
}

Permission.initialize(sequelize);
Permission.applyScopes();

export default Permission;
