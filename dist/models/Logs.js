"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    action: {
        type: String,
        required: true,
        enum: ["reservation", "exit", "entry", "cancellation"],
    },
    userId: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Log", logSchema);
