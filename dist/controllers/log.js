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
exports.getAllLogs = exports.createLog = void 0;
const Logs_1 = __importDefault(require("../models/Logs"));
const createLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, userId, details } = req.body;
    try {
        const log = new Logs_1.default({ action, userId, details });
        yield log.save();
        res.status(201).json({ message: 'Log created successfully', log });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating log', error });
    }
});
exports.createLog = createLog;
const getAllLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield Logs_1.default.find();
        res.status(200).json(logs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error });
    }
});
exports.getAllLogs = getAllLogs;
