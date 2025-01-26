import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
    try {
        await dbConnect(); // Ensure database connection is established

        const { code, newPassword } = await req.json(); // Get token and new password
        // Validate input
        if (!code || !newPassword) {
            return NextResponse.json({ error: 'code and new password are required.' }, { status: 422 });
        }

        // Find the user with the reset code and check if it has expired
        const user = await User.findOne({
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }, // Check if the code is valid (not expired)
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired reset code.' }, { status: 422 });
        }

        // Validate password (you can add more checks like minimum length)
        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 422 });
        }

        // Update user's password
        user.password = newPassword; // The pre-save hook will handle hashing the password

        // Clear the reset code and expiration time
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Save the updated user
        await user.save();

        // Return a success message
        return NextResponse.json({ message: 'Password has been reset successfully.' });

    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
