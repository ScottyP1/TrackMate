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
        const allowedUpdates = ["name", "password", "favorites"];
        const keysToUpdate = Object.keys(updates);
        const isValidUpdate = keysToUpdate.every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            return new Response("Invalid fields in updates", { status: 400 });
        }

        // Handle favorites: If it's an array of objects, extract the trackId
        if (updates.favorites && Array.isArray(updates.favorites)) {
            const extractedFavorites = updates.favorites.map(fav => {
                // If the item is an object with a trackId, extract the trackId
                if (fav && fav.trackId) {
                    return fav.trackId; // Only store the trackId as a string
                }
                return fav; // If it's already a string, keep it
            });

            updates.favorites = extractedFavorites; // Assign the extracted array
        }

        // Fetch the user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Handle password update if present
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
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
