"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access Denied: Workers only' });
    }
};
exports.default = isAdmin;
