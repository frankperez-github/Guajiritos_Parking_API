"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        res.status(403).json({ message: "Access Denied: No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtToken);
        if (!decoded.id || !decoded.role) {
            res.status(400).json({ message: "Invalid Token: Missing id or role" });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Invalid Token", error: error.message });
        return;
    }
};
exports.default = authenticate;
