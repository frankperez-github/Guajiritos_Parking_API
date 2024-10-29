import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './Users';
import ParkingSpot from './ParkingSpots';

class Reservation extends Model {
    public id!: string;
    public userId!: string;
    public parkingSpotId!: string;
    public reservationStart!: Date;
    public reservationEnd!: Date;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Reservation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      parkingSpotId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: ParkingSpot,
          key: 'id',
        },
      },
      reservationStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reservationEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'reservations',
      sequelize,
      timestamps: true,
    }
  );

export default Reservation;
