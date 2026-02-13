"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ message: 'Missing Authorization header' });
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token)
        return res.status(401).json({ message: 'Invalid Authorization header' });
    try {
        const secret = process.env.JWT_SECRET || 'devsecret';
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.userId = payload.id;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
