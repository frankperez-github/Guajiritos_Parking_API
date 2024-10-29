"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Users_1 = __importDefault(require("./Users"));
const ParkingSpots_1 = __importDefault(require("./ParkingSpots"));
class Reservation extends sequelize_1.Model {
}
Reservation.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users_1.default,
            key: 'id',
        },
    },
    parkingSpotId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: ParkingSpots_1.default,
            key: 'id',
        },
    },
    reservationStart: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    reservationEnd: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'reservations',
    sequelize: database_1.default,
    timestamps: true,
});
exports.default = Reservation;
