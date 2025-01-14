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

        // Validate allowed fields (name, password, favorites)
        const allowedUpdates = ["name", "password", "favorites", "profileAvatar"];
        const keysToUpdate = Object.keys(updates);
        const isValidUpdate = keysToUpdate.every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            return new Response("Invalid fields in updates", { status: 400 });
        }

        // Handle favorites: Just directly assign the favorites array (no need for extraction)
        if (updates.favorites && Array.isArray(updates.favorites)) {
            updates.favorites = updates.favorites;  // Directly use the provided favorites array
        }

        // Fetch the user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Update the user (ignoring favorites field since we handled it separately)
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true, runValidators: true } // Ensure validation and return the updated document
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
