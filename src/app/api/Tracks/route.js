import Track from '@/lib/models/Track';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { dbConnect } from '@/lib/db'; // Import the dbConnect function

// Geocoding function to get latitude and longitude from a zip code
async function geocodeZipCode(zipCode) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;  // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const location = response.data.results[0]?.geometry.location;
        if (location) {
            return { lat: location.lat, lng: location.lng };
        }
        return null;
    } catch (error) {
        console.error('Error geocoding zip code:', error);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zipCode');
    let radius = searchParams.get('radius'); // Ensure we fetch the radius parameter

    // If radius is not provided or is invalid, use the default value (50 miles)
    if (!radius || isNaN(radius) || radius <= 0) {
        radius = 50; // Default radius in miles if not provided or invalid
    }


    try {
        await dbConnect(); // Ensure the database connection is established before handling the request

        // If no zip code is provided, return the first 10 tracks from the database
        if (!zipCode) {
            const tracks = await Track.find().limit(12).lean(); // Fetch first 10 tracks from the database
            return NextResponse.json(tracks);
        }

        // Step 1: Get latitude and longitude of the user-provided zip code
        const userLocation = await geocodeZipCode(zipCode);
        if (!userLocation) {
            return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 });
        }

        // Step 2: Convert radius to meters (miles to meters conversion: 1 mile = 1609.34 meters)
        const radiusInMeters = radius * 1609.34; // Convert miles to meters

        // Step 3: Query the database for tracks within the radius
        const tracks = await Track.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLocation.lng, userLocation.lat]  // [longitude, latitude]
                    },
                    $maxDistance: radiusInMeters  // Use radius in meters
                }
            }
        }).lean();

        // If no tracks are found, return a 404 response with an error message
        if (tracks.length === 0) {
            return NextResponse.json({ error: 'No tracks found within the specified radius' }, { status: 404 });
        }

        // Step 4: Return the tracks found
        return NextResponse.json(tracks);
    } catch (error) {
        // Catch and log any errors
        console.error('Error fetching tracks:', error);
        return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }
}
