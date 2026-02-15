"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Room_1 = __importDefault(require("../models/Room"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const rooms = await Room_1.default.find();
    res.json(rooms);
});
router.get('/:id', async (req, res) => {
    const room = await Room_1.default.findById(req.params.id);
    if (!room)
        return res.status(404).json({ message: 'Room not found' });
    res.json(room);
});
// For simplicity, allow creating rooms without auth for now
router.post('/', async (req, res) => {
    const { name, capacity, facilities, price, image } = req.body;
    const room = await Room_1.default.create({ name, capacity, facilities, price, image });
    res.json(room);
});
exports.default = router;
