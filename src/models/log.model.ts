import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

interface LogAttributes {
  uuid?: string;
  log: unknown;
}

class Log extends Model<LogAttributes> {
  public uuid!: string;
  public log!: unknown;

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
        log: {
          type: DataTypes.JSON,
          allowNull: false,
          get() {
            const logData = this.getDataValue('log');
            const parsedLogData =
              typeof logData === 'string' ? JSON.parse(logData) : logData;
            if (parsedLogData && typeof parsedLogData === 'object') {
              parsedLogData.payload = JSON.parse(parsedLogData.payload);
              parsedLogData['response-headers'] = JSON.parse(
                parsedLogData['response-headers']
              );
            }

            return parsedLogData;
          }
        }
      },
      {
        sequelize,
        modelName: 'log',
        tableName: 'logs',
        timestamps: true,
        underscored: true
      }
    );
  }

  public static applyScopes(): void {
    this.addScope('defaultScope', {
      order: [['createdAt', 'DESC']]
    });
  }
}

sequelize && Log.initialize(sequelize);
Log.applyScopes();

export default Log;
