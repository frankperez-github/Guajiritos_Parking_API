"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ParkingSpot extends sequelize_1.Model {
}
ParkingSpot.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    vehicleDetails: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
}, {
    tableName: 'parking_spots',
    sequelize: database_1.default,
    timestamps: true,
});
exports.default = ParkingSpot;
