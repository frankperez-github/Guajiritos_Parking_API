"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParkingSpots_1 = __importDefault(require("./ParkingSpots"));
const Reservation_1 = __importDefault(require("./Reservation"));
const Users_1 = __importDefault(require("./Users"));
const setupAssociations = () => {
    ParkingSpots_1.default.hasMany(Reservation_1.default, { foreignKey: 'parkingSpotId', as: 'reservations' });
    Reservation_1.default.belongsTo(Users_1.default, { foreignKey: 'userId', as: 'user' });
    Reservation_1.default.belongsTo(ParkingSpots_1.default, { foreignKey: 'parkingSpotId', as: 'parkingSpot' });
    Users_1.default.hasMany(Reservation_1.default, { foreignKey: 'userId', as: 'reservations' });
};
exports.default = setupAssociations;
