import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

import User from './user.model';
import Permission from './permission.model';

interface RoleAttributes {
  uuid?: string;
  name: string;
}

class Role extends Model<RoleAttributes> {
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
          allowNull: false,
          unique: true
        }
      },
      {
        sequelize,
        modelName: 'role',
        tableName: 'roles',
        timestamps: true,
        underscored: true
      }
    );
  }

  public static associate(models: {
    User: typeof User;
    Permission: typeof Permission;
  }): void {
    this.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users'
    });

    this.belongsToMany(models.Permission, {
      through: 'RolePermissions',
      as: 'permissions',
      foreignKey: 'roleId'
    });
  }

  public static applyScopes(): void {
    this.addScope('defaultScope', {
      order: [['createdAt', 'DESC']]
    });
  }
}

Role.initialize(sequelize);
Role.applyScopes();

export default Role;
