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
exports.initializeDatabase = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = __importDefault(require("./config/database"));
const logs_1 = __importDefault(require("./routes/logs"));
const user_1 = __importDefault(require("./routes/user"));
const parking_1 = __importDefault(require("./routes/parking"));
const auth_1 = __importDefault(require("./routes/auth"));
const InitParking_1 = __importDefault(require("./utils/InitParking"));
const InitAssociations_1 = __importDefault(require("./models/InitAssociations"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
(0, InitAssociations_1.default)();
app.use('/api/logs', logs_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/parking', parking_1.default);
const initializeDatabase = (test) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongoURI);
        console.log('MongoDB connected for logs');
        yield database_1.default.authenticate();
        console.log('PostgreSQL database connected successfully');
        yield database_1.default.sync({ force: true });
        console.log('Database synchronized successfully');
        yield (0, InitParking_1.default)(100);
    }
    catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
});
exports.initializeDatabase = initializeDatabase;
const startServer = (test) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.initializeDatabase)(test);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
if (process.env.NODE_ENV !== 'test') {
    startServer(false);
}
exports.default = app;
