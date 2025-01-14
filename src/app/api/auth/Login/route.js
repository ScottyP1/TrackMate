import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import validator from 'validator'; // Import the validator

export async function POST(req) {
    try {
        await dbConnect(); // Ensure the database connection is established

        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            console.log("Missing email or password");
            return NextResponse.json({ error: 'Must provide email and password.' }, { status: 422 });
        }

        // Sanitize the email (trim and convert to lowercase)
        let sanitizedEmail = email.trim();
        sanitizedEmail = sanitizedEmail.toLowerCase();

        // Validate the email format
        if (!validator.isEmail(sanitizedEmail)) {
            return NextResponse.json({ error: 'Invalid email address format.' }, { status: 422 });
        }

        // Find the user by email
        const user = await User.findOne({ email: sanitizedEmail });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 422 });
        }

        // Use the comparePassword method from the schema
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 422 });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token and user info
        return NextResponse.json({
            token,
            userId: user._id,
            email: user.email,
            profileAvatar: user.profileAvatar,
            name: user.name,
            favorites: user.favorites || []  // Ensure favorites is returned (empty array if undefined)
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
