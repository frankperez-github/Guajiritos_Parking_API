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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const Users_1 = __importDefault(require("../../models/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const testsConfiguration_1 = require("./testsConfiguration");
describe('Users endpoint with roles', () => {
    it('Should create a new user successfully (Admin only)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
            .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'cliente',
        });
        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.name).toBe('Test User');
        expect(response.body.user.email).toBe('test@example.com');
    }));
    it('Should retrieve all users (Admin only)', () => __awaiter(void 0, void 0, void 0, function* () {
        yield Users_1.default.destroy({ where: {}, cascade: true });
        yield Users_1.default.create({ name: 'User 1', email: 'user1@example.com', password: 'password', role: 'cliente' });
        yield Users_1.default.create({ name: 'User 2', email: 'user2@example.com', password: 'password', role: 'cliente' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/users')
            .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.users).toHaveLength(2);
        expect(response.body.users[0].email).toBe('user1@example.com');
        expect(response.body.users[1].email).toBe('user2@example.com');
    }));
    it('Should retrieve a user by ID (Any authenticated user)', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield Users_1.default.create({ name: 'Test User', email: 'testuser@example.com', password: 'password', role: 'cliente' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${testsConfiguration_1.clientToken}`);
        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe('testuser@example.com');
    }));
    it('Should return 404 if user is not found (Any authenticated user)', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentUserId = 'b3b495e1-1b7b-46e0-9af2-b8d21f5d7d1f';
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/users/${nonExistentUserId}`)
            .set('Authorization', `Bearer ${testsConfiguration_1.clientToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    }));
    it('Should update an existing user (Admin only)', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield Users_1.default.create({ name: 'Old Name', email: 'old@example.com', password: 'password', role: 'cliente' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`)
            .send({
            name: 'Updated Name',
            email: 'updated@example.com',
            password: 'newpassword123',
            role: 'admin',
        });
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe('Updated Name');
        expect(response.body.user.email).toBe('updated@example.com');
        const updatedUser = yield Users_1.default.findByPk(user.id);
        const isPasswordCorrect = yield bcrypt_1.default.compare('newpassword123', updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password);
        expect(isPasswordCorrect).toBe(true);
    }));
    it('Should delete an existing user (Admin only)', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield Users_1.default.create({ name: 'Delete Me', email: 'delete@example.com', password: 'password', role: 'cliente' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted');
        const deletedUser = yield Users_1.default.findByPk(user.id);
        expect(deletedUser).toBeNull();
    }));
    it('Should return 404 when deleting a non-existent user (Admin only)', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentUserId = 'b3b495e1-1b7b-46e0-9af2-b8d21f5d7d1f';
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/users/${nonExistentUserId}`)
            .set('Authorization', `Bearer ${testsConfiguration_1.adminToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    }));
});
