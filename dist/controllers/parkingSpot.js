"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitParking = exports.enterParking = exports.cancelReservation = exports.reserveParkingSpot = exports.getAllParkingSpots = void 0;
const ParkingSpots_1 = __importDefault(require("../models/ParkingSpots"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const LogService_1 = __importDefault(require("../utils/LogService"));
const { Op } = require('sequelize');
const getAllParkingSpots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spots = yield ParkingSpots_1.default.findAll();
        res.status(200).json({ spots });
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting parking spots', error });
    }
});
exports.getAllParkingSpots = getAllParkingSpots;
const reserveParkingSpot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { vehicleDetails, reservationStart, reservationEnd } = req.body;
    try {
        const availableSpot = yield ParkingSpots_1.default.findOne({
            where: {
                isAvailable: true
            },
        });
        if (!availableSpot) {
            res.status(400).json({ message: 'No parking spots available for the selected time' });
            return;
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const reservation = yield Reservation_1.default.create({
            reservationStart,
            reservationEnd,
            userId,
            parkingSpotId: availableSpot.id,
        });
        availableSpot.isAvailable = true;
        yield availableSpot.save();
        res.status(201).json({ reservation });
        yield (0, LogService_1.default)('reservation', userId, `Reserved parking spot for vehicle: ${vehicleDetails}`);
    }
    catch (error) {
        res.status(500).json({ message: 'Error reserving parking spot', error });
    }
});
exports.reserveParkingSpot = reserveParkingSpot;
const cancelReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationId = req.params.id;
    try {
        const reservation = yield Reservation_1.default.findByPk(reservationId);
        if (!reservation) {
            res.status(404).json({ message: 'Reservation not found' });
            return;
        }
        const parkingSpot = yield ParkingSpots_1.default.findByPk(reservation.parkingSpotId);
        if (parkingSpot) {
            parkingSpot.isAvailable = true;
            yield parkingSpot.save();
        }
        yield reservation.destroy();
        res.status(200).json({ message: 'Reservation cancelled successfully' });
        yield (0, LogService_1.default)('cancellation', reservation.userId, `Cancelled reservation: ${reservationId}`);
    }
    catch (error) {
        res.status(500).json({ message: 'Error cancelling reservation', error });
    }
});
exports.cancelReservation = cancelReservation;
const enterParking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { vehicleDetails, entryTime } = req.body;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const reservedSpotsIds = (yield Reservation_1.default.findAll({
            where: {
                userId: userId
            }
        })).map((x) => {
            if (new Date(entryTime) >= new Date(x.reservationStart)
                && new Date(entryTime) < new Date(x.reservationEnd))
                return x.dataValues.parkingSpotId;
        }).filter((x) => x !== undefined);
        const availableReservationSpot = (yield ParkingSpots_1.default.findAll()).map(x => {
            if (x.isAvailable === true && reservedSpotsIds.includes(x.id))
                return x;
        }).find(x => x !== undefined);
        const vehicleInParking = yield ParkingSpots_1.default.findOne({
            where: {
                isAvailable: false,
                vehicleDetails
            }
        });
        if (vehicleInParking) {
            res.status(404).json({ message: 'There is a vehicle inside the parking with received description. Parking spot: ' + vehicleInParking.id });
            return;
        }
        if (availableReservationSpot) {
            availableReservationSpot.isAvailable = false;
            availableReservationSpot.vehicleDetails = vehicleDetails;
            yield availableReservationSpot.save();
            res.status(200).json({ message: `Vehicle with description "${vehicleDetails}" entered the reserved parking spot ${availableReservationSpot.id}` });
            yield (0, LogService_1.default)('entry', userId, `Vehicle with description "${vehicleDetails}" entered reserved parking spot: ${availableReservationSpot.id}`);
            return;
        }
        const availableSpot = yield ParkingSpots_1.default.findOne({
            where: { isAvailable: true }
        });
        if (!availableSpot) {
            res.status(404).json({ message: 'No available parking spots found at the requested time' });
            return;
        }
        availableSpot.isAvailable = false;
        availableSpot.vehicleDetails = vehicleDetails;
        yield availableSpot.save();
        res.status(200).json({ message: `Vehicle entered the parking spot ${availableSpot.id}` });
        yield (0, LogService_1.default)('entry', userId, `Vehicle with description \"${vehicleDetails}\" entered available parking spot: ${availableSpot.id}`);
    }
    catch (error) {
        res.status(500).json({ message: 'Error entering parking: ' + error });
    }
});
exports.enterParking = enterParking;
const exitParking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const parkingSpotId = req.params.id;
    try {
        const parkingSpot = yield ParkingSpots_1.default.findByPk(parkingSpotId);
        if (!parkingSpot || parkingSpot.isAvailable) {
            res.status(404).json({ message: 'Parking spot not found or already available' });
            return;
        }
        parkingSpot.isAvailable = true;
        yield parkingSpot.save();
        res.status(200).json({ message: 'Vehicle exited the parking spot' });
        yield (0, LogService_1.default)('exit', (_c = req.user) === null || _c === void 0 ? void 0 : _c.id, `Vehicle exited parking spot ID: ${parkingSpotId}`);
    }
    catch (error) {
        res.status(500).json({ message: 'Error exiting parking', error });
    }
});
exports.exitParking = exitParking;
