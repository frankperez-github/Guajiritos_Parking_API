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
const ParkingSpots_1 = __importDefault(require("../models/ParkingSpots"));
const initializeParkingSpots = (totalSpots) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingSpots = yield ParkingSpots_1.default.count();
        if (existingSpots === 0) {
            const spots = [];
            for (let i = 1; i <= totalSpots; i++) {
                spots.push({ location: `Spot ${i}`, isAvailable: true });
            }
            yield ParkingSpots_1.default.bulkCreate(spots);
            console.log(`${totalSpots} parking spots created.`);
        }
        else {
            console.log('Parking spots already initialized.');
        }
    }
    catch (error) {
        console.error('Error initializing parking spots:', error);
    }
});
exports.default = initializeParkingSpots;
