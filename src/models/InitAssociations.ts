import ParkingSpot from './ParkingSpots';
import Reservation from './Reservation';
import User from './Users';

const setupAssociations = () => {
  ParkingSpot.hasMany(Reservation, { foreignKey: 'parkingSpotId', as: 'reservations' });

  Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Reservation.belongsTo(ParkingSpot, { foreignKey: 'parkingSpotId', as: 'parkingSpot' });

  User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
};


export default setupAssociations;
