import { Sequelize, Model, DataTypes } from 'sequelize';

import { sequelize } from '../database';

export interface PermissionAttributes {
  uuid?: number;
  name: string;
  description?: string;
}

class Permission extends Model<PermissionAttributes> {
  public uuid!: number;
  public name!: string;
  public description!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static initialize(sequelize: Sequelize): void {
    this.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
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

  public static applyScopes(): void {
    this.addScope('defaultScope', {
      attributes: {
        exclude: ['created_at', 'updated_at']
      },
      order: [['created_at', 'DESC']]
    });
    this.addScope('withTimestamps', {
      attributes: {
        include: ['created_at', 'updated_at']
      }
    });
  }
}

sequelize && Permission.initialize(sequelize);
Permission.applyScopes();

export default Permission;
