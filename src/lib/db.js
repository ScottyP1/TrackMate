// lib/db.js
import mongoose from 'mongoose';

let isConnected = false;

export const dbConnect = async () => {
    if (isConnected) {
        return;
    }

    const dbUri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(dbUri); // Removed deprecated options
        isConnected = true;
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};
