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
exports.clientUserId = exports.adminUserId = exports.clientToken = exports.adminToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("../../models/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logs_1 = __importDefault(require("../../models/Logs"));
const Reservation_1 = __importDefault(require("../../models/Reservation"));
const ParkingSpots_1 = __importDefault(require("../../models/ParkingSpots"));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const adminPassword = yield bcrypt_1.default.hash('adminpassword', 10);
    const clientPassword = yield bcrypt_1.default.hash('clientpassword', 10);
    const adminUser = yield Users_1.default.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
    });
    const clientUser = yield Users_1.default.create({
        name: 'Client User',
        email: 'client@example.com',
        password: clientPassword,
        role: 'cliente',
    });
    exports.adminUserId = adminUser.id;
    exports.clientUserId = clientUser.id;
    exports.adminToken = jsonwebtoken_1.default.sign({ id: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET);
    exports.clientToken = jsonwebtoken_1.default.sign({ id: clientUser.id, role: clientUser.role }, process.env.JWT_SECRET);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Logs_1.default.deleteMany({});
    yield Reservation_1.default.destroy({ where: {}, cascade: true });
    yield ParkingSpots_1.default.update({ isAvailable: true, vehicleDetails: '' }, { where: {} });
    yield Users_1.default.destroy({ where: {}, cascade: true });
}));
