"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Room_1 = __importDefault(require("../models/Room"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hoteldev';
async function main() {
    await mongoose_1.default.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    await Room_1.default.deleteMany({});
    await User_1.default.deleteMany({});
    const rooms = [
        { name: 'Standard Room', capacity: 2, facilities: ['wifi', 'ac'], price: 50, image: 'https://images.unsplash.com/photo-1560440770-69b1b82a0d9f?w=1000&q=60&auto=format&fit=crop' },
        { name: 'Deluxe Room', capacity: 3, facilities: ['wifi', 'ac', 'tv'], price: 90, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&q=60&auto=format&fit=crop' },
        { name: 'Suite', capacity: 5, facilities: ['wifi', 'ac', 'tv', 'minibar'], price: 150, image: 'https://images.unsplash.com/photo-1501117716987-c8e5e6a58b0a?w=1000&q=60&auto=format&fit=crop' }
    ];
    await Room_1.default.create(rooms);
    const pw = await bcryptjs_1.default.hash('adminpass', 10);
    await User_1.default.create({ name: 'Admin', email: 'admin@example.com', password: pw });
    console.log('Seed completed');
    process.exit(0);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
