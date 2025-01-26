import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import nodemailer from 'nodemailer';
import validator from 'validator';

export async function POST(req) {
    try {
        await dbConnect(); // Ensure the database connection is established

        const { email } = await req.json();

        // Validate input
        if (!email) {
            return NextResponse.json({ error: 'Must provide an email address.' }, { status: 422 });
        }

        // Sanitize and validate email
        let sanitizedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(sanitizedEmail)) {
            return NextResponse.json({ error: 'Invalid email address format.' }, { status: 422 });
        }

        // Find the user by email
        const user = await User.findOne({ email: sanitizedEmail });

        if (!user) {
            return NextResponse.json({ error: 'Email not associated with any account.' }, { status: 422 });
        }

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 3600000; // Code expires in 1 hour
        await user.save();

        // Send the verification code via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Your Verification Code',
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>
                   <p>This code is valid for 1 hour.</p>`,
        });

        return NextResponse.json({ message: 'Verification code has been sent to your email.' });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
