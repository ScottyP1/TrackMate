import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import { dbConnect } from '@/lib/db'; // Import the dbConnect function

// POST /api/auth/register
export async function POST(req) {
    try {
        // Connect to the database
        await dbConnect(); // Ensure the database connection is established before handling the request

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
        console.error('Error:', err);
        return NextResponse.json({ error: err.message }, { status: 422 });
    }
}
