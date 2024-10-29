"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parkingSpot_1 = require("../controllers/parkingSpot");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isWorker_1 = __importDefault(require("../middlewares/isWorker"));
const router = (0, express_1.Router)();
router.get('/', auth_1.default, isWorker_1.default, parkingSpot_1.getAllParkingSpots);
router.post('/reserve', auth_1.default, parkingSpot_1.reserveParkingSpot);
router.delete('/cancel/:id', auth_1.default, parkingSpot_1.cancelReservation);
router.post('/enter', auth_1.default, parkingSpot_1.enterParking);
router.post('/exit/:id', auth_1.default, parkingSpot_1.exitParking);
exports.default = router;
