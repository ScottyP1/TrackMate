import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import User from '@/lib/models/User';
const bcrypt = require('bcrypt')

// POST /api/auth/login
export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Must provide email and password.' }, { status: 422 });
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 422 });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 422 });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response
        return NextResponse.json({ token, email, profileAvatar: user.profileAvatar });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


