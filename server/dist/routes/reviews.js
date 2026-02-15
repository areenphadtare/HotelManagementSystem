"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Review_1 = __importDefault(require("../models/Review"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/room/:roomId', async (req, res) => {
    const reviews = await Review_1.default.find({ roomId: req.params.roomId }).sort({ createdAt: -1 });
    res.json(reviews);
});
router.post('/', auth_1.requireAuth, async (req, res) => {
    const { roomId, rating, comment } = req.body;
    if (!roomId || !rating)
        return res.status(400).json({ message: 'Missing fields' });
    const review = await Review_1.default.create({ roomId, userId: req.userId, rating, comment });
    res.json(review);
});
exports.default = router;
