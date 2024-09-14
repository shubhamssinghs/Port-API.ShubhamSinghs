import { Sequelize, Model, DataTypes } from 'sequelize';

import { sequelize } from '../database';
import { avatar } from '../utils';

export interface UserAttributes {
  uuid?: string;
  name: string;
  email: string;
  password: string;
  img?: string;
  active?: boolean;
  verification_token?: string;
  verification_token_expires?: Date | null;
  verified_at?: Date;
}

class User extends Model<UserAttributes> {
  public uuid!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public img!: string;
  public active!: boolean;
  public verification_token!: string;
  public verification_token_expires!: Date | null;
  public verified_at!: Date;

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
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        img: {
          type: DataTypes.STRING,
          allowNull: true
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        verification_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        verification_token_expires: {
          type: DataTypes.DATE,
          allowNull: true
        },
        verified_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'user',
        tableName: 'users',
        timestamps: true,
        underscored: true,
        hooks: {
          beforeCreate: (user: User) => {
            if (!user.img) {
              user.img = avatar.generateAvatar(user.name);
            }
          }
        }
      }
    );
  }

  public static applyScopes(): void {
    this.addScope('defaultScope', {
      attributes: {
        exclude: [
          'password',
          'verification_token',
          'verification_token_expires',
          'verified_at'
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    this.addScope('withPassword', {
      attributes: { include: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    this.addScope('withVerifiedAt', {
      attributes: { include: ['verified_at'] }
    });
  }
}

User.initialize(sequelize);
User.applyScopes();

export default User;
