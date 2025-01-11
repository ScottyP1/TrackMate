import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import validator from 'validator'; // Import the validator
const bcrypt = require('bcrypt')

export async function POST(req) {
    try {
        await dbConnect(); // Ensure the database connection is established

        const { email, password } = await req.json();

        console.log("Login attempt:", email); // Log the email being passed in

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
            console.log("User not found: ", sanitizedEmail); // Log if the user is not found
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 422 });
        }

        console.log("User found:", user.email); // Log the user's email found in the database

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch); // Log the result of bcrypt comparison

        if (!isMatch) {
            console.log("Password does not match!"); // Log password mismatch
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
            name: user.name
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
