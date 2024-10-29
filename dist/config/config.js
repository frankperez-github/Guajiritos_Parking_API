"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === 'test') {
    dotenv_1.default.config({ path: '.env.test' });
}
else {
    dotenv_1.default.config();
}
const config = {
    dbHost: process.env.DB_HOST || '',
    dbName: process.env.DB_NAME || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    mongoURI: process.env.MONGO_URI || '',
    jwtToken: process.env.JWT_SECRET || ''
};
exports.default = config;
