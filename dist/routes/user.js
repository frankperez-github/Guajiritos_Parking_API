"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = (0, express_1.Router)();
router.post('/', user_1.createUser);
router.get('/', auth_1.default, isAdmin_1.default, user_1.getAllUsers);
router.get('/:id', auth_1.default, user_1.getUserById);
router.put('/:id', auth_1.default, isAdmin_1.default, user_1.updateUser);
router.delete('/:id', auth_1.default, isAdmin_1.default, user_1.deleteUser);
exports.default = router;
