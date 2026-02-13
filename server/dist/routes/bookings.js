"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// create booking with conflict check
router.post('/', auth_1.requireAuth, async (req, res) => {
    const { roomId, start, end, facilities, total } = req.body;
    if (!roomId || !start || !end)
        return res.status(400).json({ message: 'Missing fields' });
    const s = new Date(start);
    const e = new Date(end);
    if (s >= e)
        return res.status(400).json({ message: 'End must be after start' });
    // conflict check: existing booking where start <= e && end >= s
    const conflicts = await Booking_1.default.find({ roomId, $expr: { $and: [{ $lte: ['$start', e] }, { $gte: ['$end', s] }] } });
    // the above $expr query may be less portable; do a simpler query
    const simpleConf = await Booking_1.default.find({ roomId, start: { $lte: e }, end: { $gte: s } });
    if (simpleConf.length)
        return res.status(409).json({ message: 'Room already booked for these dates' });
    const days = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    const booking = await Booking_1.default.create({ roomId, userId: req.userId, start: s, end: e, days, facilities, total });
    res.json(booking);
});
router.get('/me', auth_1.requireAuth, async (req, res) => {
    const bookings = await Booking_1.default.find({ userId: req.userId }).sort({ start: -1 });
    res.json(bookings);
});
exports.default = router;
