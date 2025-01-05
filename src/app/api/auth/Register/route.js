import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';

// POST /api/auth/register
export async function POST(req) {
    try {
        console.log('Received request:', req);
        const { name, email, password, profileAvatar } = await req.json(); // Include profileAvatar
        console.log('Data extracted:', { name, email, profileAvatar });

        // Create and save the user
        const user = new User({
            name,
            email,
            password,
            profileAvatar // Save avatar in the user model
        });
        console.log('Saving user...');
        await user.save();
        console.log('User saved:', user);

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        console.log('JWT generated:', token);

        // Return success response
        return NextResponse.json({
            token,
            profileAvatar: user.profileAvatar // Send the avatar along with the token
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: err.message }, { status: 422 });
    }
}
