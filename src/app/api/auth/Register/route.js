import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';

// POST /api/auth/register
export async function POST(req) {
    try {
        const { name, email, password, profileAvatar } = await req.json(); // Include profileAvatar
        // Create and save the user
        const user = new User({
            name,
            email,
            password,
            profileAvatar // Save avatar in the user model
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Return success response
        return NextResponse.json({
            token,
            profileAvatar: user.profileAvatar // Send the avatar along with the token
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 422 });
    }
}
