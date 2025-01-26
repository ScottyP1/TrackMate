import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
    try {
        await dbConnect();

        const { email, code } = await req.json();
        // Validate inputs
        if (!email || !code) {
            return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        // Check if the code matches and is not expired
        if (
            user.verificationCode !== parseInt(code, 10) || // Compare the stored code with the submitted code
            !user.verificationCodeExpires ||              // Ensure the expiration field exists
            Date.now() > user.verificationCodeExpires     // Check expiration
        ) {
            return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
        }

        // Code is valid, return success
        return NextResponse.json({ message: 'Verification successful.' });

    } catch (err) {
        console.error('Error verifying code:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
