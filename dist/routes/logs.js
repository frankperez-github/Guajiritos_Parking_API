"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_1 = require("../controllers/log");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = (0, express_1.Router)();
router.post('/', log_1.createLog);
router.get('/', auth_1.default, isAdmin_1.default, log_1.getAllLogs);
exports.default = router;
