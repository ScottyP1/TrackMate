import { NextResponse } from 'next/server';
import User from '@/lib/models/User';  // Adjust the import path as needed

export async function GET(req, { params }) {

    const { user } = await params;
    try {
        // Fetch the user from the database using the extracted userId
        const userFromDb = await User.findById(user);  // Use the userId to query the DB
        if (!userFromDb) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return the user data if found
        return NextResponse.json({ user: userFromDb });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}
