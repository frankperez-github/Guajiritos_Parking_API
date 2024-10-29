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
const app_1 = __importDefault(require("../../app"));
const ParkingSpots_1 = __importDefault(require("../../models/ParkingSpots"));
const Reservation_1 = __importDefault(require("../../models/Reservation"));
const supertest_1 = __importDefault(require("supertest"));
const Logs_1 = __importDefault(require("../../models/Logs"));
const testsConfiguration_1 = require("./testsConfiguration");
describe('ParkingSpot Endpoints', () => {
    describe('Reserve', () => {
        it('Should reserve an available parking spot and create a log.', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/reserve')
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
                .send({
                vehicleDetails: 'Test Vehicle',
                reservationStart: new Date(),
                reservationEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
            });
            expect(response.statusCode).toBe(201);
            expect(response.body.reservation.parkingSpotId).toBeDefined();
            const createLog = yield Logs_1.default.findOne({
                where: { details: `Reserved parking spot for vehicle: Test Vehicle` },
            });
            expect(createLog).toBeDefined();
        }));
    });
    describe('Cancel', () => {
        it('Should cancel a previously created reservation and create a cancellation log.', () => __awaiter(void 0, void 0, void 0, function* () {
            const spot = yield ParkingSpots_1.default.create({ isAvailable: false, vehicleDetails: 'Test Vehicle' });
            try {
                const reservation = yield Reservation_1.default.create({
                    userId: testsConfiguration_1.adminUserId,
                    parkingSpotId: spot.id,
                    reservationStart: new Date(),
                    reservationEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
                });
                const response = yield (0, supertest_1.default)(app_1.default)
                    .delete(`/api/parking/cancel/${reservation.id}`)
                    .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`);
                expect(response.status).toBe(200);
                const updatedSpot = yield ParkingSpots_1.default.findByPk(spot.id);
                expect(updatedSpot === null || updatedSpot === void 0 ? void 0 : updatedSpot.isAvailable).toBe(true);
                const cancelLog = yield Logs_1.default.findOne({
                    where: { details: `Cancelled reservation: ${reservation.id}` },
                });
                expect(cancelLog).toBeDefined();
            }
            catch (error) {
                console.log(error);
            }
        }));
    });
    describe('Enter', () => {
        it('Should allow entry to a reserved parking spot and create a log.', () => __awaiter(void 0, void 0, void 0, function* () {
            const spot = yield ParkingSpots_1.default.create({ isAvailable: true, vehicleDetails: '' });
            yield Reservation_1.default.create({
                userId: testsConfiguration_1.adminUserId,
                parkingSpotId: spot.id,
                reservationStart: new Date(),
                reservationEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/enter')
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
                .send({
                vehicleDetails: 'Test Vehicle',
                entryTime: new Date(),
            });
            expect(response.status).toBe(200);
            const updatedSpot = yield ParkingSpots_1.default.findByPk(spot.id);
            expect(updatedSpot === null || updatedSpot === void 0 ? void 0 : updatedSpot.isAvailable).toBe(false);
            const logDetails = `Vehicle with description "Test Vehicle" entered available parking spot: ${updatedSpot === null || updatedSpot === void 0 ? void 0 : updatedSpot.id}`;
            const vehicleInParkingLog = yield Logs_1.default.findOne({
                where: {
                    details: logDetails,
                },
            });
            expect(vehicleInParkingLog).toBeDefined();
        }));
        it('Should reject entry when all parking spots are occupied.', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Poner todos los ParkingSpots en la base de datos como ocupados
            yield ParkingSpots_1.default.update({ isAvailable: false }, { where: {} });
            // Intentar entrar en el aparcamiento
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/enter')
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
                .send({
                vehicleDetails: 'Test Vehicle 4',
                entryTime: new Date(),
            });
            // Verificar que la respuesta indique que no hay plazas disponibles
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No available parking spots found at the requested time');
            // Verificar que no se haya creado un log con un detalle de entrada exitosa
            const logDetails = `Vehicle with description "Test Vehicle 4" entered available parking spot: ${(_a = response.body.reservation) === null || _a === void 0 ? void 0 : _a.parkingSpotId}`;
            const vehicleInParkingLog = yield Logs_1.default.findOne({
                where: { details: logDetails },
            });
            expect(vehicleInParkingLog).toBeNull();
        }));
        it('Should reject entry to a reserved parking spot after the reservation time has ended when all spots are occupied.', () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            yield ParkingSpots_1.default.update({ isAvailable: false }, { where: {} });
            const spot = yield ParkingSpots_1.default.create({ isAvailable: true, vehicleDetails: '' });
            const reservationStart = new Date();
            const reservationEnd = new Date(reservationStart.getTime() + 60 * 60 * 1000);
            yield Reservation_1.default.create({
                userId: testsConfiguration_1.adminUserId,
                parkingSpotId: spot.id,
                reservationStart,
                reservationEnd,
            });
            yield ParkingSpots_1.default.update({ isAvailable: false }, { where: { id: spot.id, isAvailable: true } });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/enter')
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
                .send({
                vehicleDetails: 'Test Vehicle',
                entryTime: new Date(reservationEnd.getTime() + 1000),
            });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No available parking spots found at the requested time');
            const logDetails = `Vehicle with description "Test Vehicle" entered available parking spot: ${(_b = response.body.reservation) === null || _b === void 0 ? void 0 : _b.parkingSpotId}`;
            const vehicleInParkingLog = yield Logs_1.default.findOne({
                where: { details: logDetails },
            });
            expect(vehicleInParkingLog).toBeNull();
        }));
        it('Should reject a second entry attempt with the same vehicle description.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield ParkingSpots_1.default.update({ isAvailable: false }, { where: {} });
            const spot = yield ParkingSpots_1.default.create({ isAvailable: true, vehicleDetails: '' });
            const reservationStart = new Date();
            const reservationEnd = new Date(reservationStart.getTime() + 60 * 60 * 1000);
            yield Reservation_1.default.create({
                userId: testsConfiguration_1.adminUserId,
                parkingSpotId: spot.id,
                reservationStart,
                reservationEnd,
            });
            const firstResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/enter')
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
                .send({
                vehicleDetails: 'Test Vehicle',
                entryTime: reservationStart,
            });
            expect(firstResponse.status).toBe(200);
            const firstLogDetails = `Vehicle with description "Test Vehicle" entered reserved parking spot: ${spot === null || spot === void 0 ? void 0 : spot.id}`;
            const firstVehicleInParkingLog = yield Logs_1.default.findOne({ details: firstLogDetails });
            expect(firstVehicleInParkingLog).toBeDefined();
            const secondResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/enter')
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
                .send({
                vehicleDetails: 'Test Vehicle',
                entryTime: reservationStart,
            });
            expect(secondResponse.status).toBe(404);
            expect(secondResponse.body.message).toBe(`There is a vehicle inside the parking with received description. Parking spot: ${spot.id}`);
            const logDetails = `Vehicle with description "Test Vehicle" entered reserved parking spot: ${spot.id}`;
            const vehicleInParkingLogs = yield Logs_1.default.find({ details: logDetails });
            expect(vehicleInParkingLogs.length).toBe(1);
        }));
    });
    describe('Exit', () => {
        it('Should allow exit from an occupied parking spot and create a log.', () => __awaiter(void 0, void 0, void 0, function* () {
            const spot = yield ParkingSpots_1.default.create({ isAvailable: false, vehicleDetails: 'Test Vehicle' });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(`/api/parking/exit/${spot.id}`)
                .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`);
            expect(response.status).toBe(200);
            const updatedSpot = yield ParkingSpots_1.default.findByPk(spot.id);
            expect(updatedSpot === null || updatedSpot === void 0 ? void 0 : updatedSpot.isAvailable).toBe(true);
            const logDetails = `Vehicle exited parking spot ID: ${spot.id}`;
            const exitLog = yield Logs_1.default.findOne({
                where: {
                    details: logDetails,
                },
            });
            expect(exitLog).toBeDefined();
        }));
    });
});
