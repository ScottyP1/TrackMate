import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import validator from 'validator'; // Import validator
const bcrypt = require('bcrypt');

// POST /api/auth/register
export async function POST(req) {
    try {
        await dbConnect(); // Ensure the database connection is established

        const { name, email, password, profileAvatar } = await req.json();

        // Sanitize and validate email
        let sanitizedEmail = email.trim().toLowerCase();
        if (!validator.isEmail(sanitizedEmail)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 422 });
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 422 });
        }

        // Create a new user
        const user = new User({
            name,
            email: sanitizedEmail,
            password: password, // Save the hashed password
            profileAvatar,
        });

        await user.save();

        // Generate JWT token after the user is created
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token and user info
        return NextResponse.json({ token, userId: user._id });
    } catch (err) {
        console.error('Error during registration:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
