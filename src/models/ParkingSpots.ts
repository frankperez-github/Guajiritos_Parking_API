import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ParkingSpot extends Model {
  public id!: string;
  public isAvailable!: boolean;
  public vehicleDetails!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ParkingSpot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    vehicleDetails: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    tableName: 'parking_spots',
    sequelize,
    timestamps: true,
  }
);


export default ParkingSpot;
