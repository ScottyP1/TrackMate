import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/lib/models/User"; // Import the User model
import bcrypt from "bcrypt"; // bcrypt for hashing password

// Handle GET request to fetch user details
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return new Response("Email is required", { status: 400 });
    }
    try {
        await dbConnect(); // Ensure the database is connected

        // Fetch the user by email
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response("Failed to fetch user", { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await dbConnect(); // Ensure the database is connected

        const body = await req.json();
        const { email, updates } = body;

        if (!email || !updates) {
            return new Response("Email and updates are required", { status: 400 });
        }

        // Validate allowed fields (name, password, favorites, friends, profileAvatar)
        const allowedUpdates = ["name", "password", "favorites", "friends", "profileAvatar"];
        const keysToUpdate = Object.keys(updates);
        const isValidUpdate = keysToUpdate.every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            return new Response("Invalid fields in updates", { status: 400 });
        }

        // Handle favorites and friends updates
        if (updates.favorites && Array.isArray(updates.favorites)) {
            updates.favorites = updates.favorites;
        }

        if (updates.friends && Array.isArray(updates.friends)) {
            updates.friends = updates.friends;  // Directly use the provided friends array
        }

        // Fetch the user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Update the user with the new fields (friends list will be updated as part of this)
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedUser) {
            return new Response("User not found", { status: 404 });
        }

        return new Response(JSON.stringify({ user: updatedUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response("Failed to update user", { status: 500 });
    }
}
