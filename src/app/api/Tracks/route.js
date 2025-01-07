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
    let radius = searchParams.get('radius');

    // Ensure a valid radius is provided, otherwise use the default value
    if (!radius || isNaN(radius) || radius <= 0) {
        radius = 50;  // Default radius in miles
    }

    // Validate the zip code format (must be 5 numeric digits)
    if (zipCode && !/^\d{5}$/.test(zipCode)) {
        return NextResponse.json({ message: 'Invalid zip code. Please provide a valid 5-digit zip code.' }, { status: 400 });
    }

    try {
        await dbConnect();  // Ensure the database connection is established

        // If no zip code is provided, return the first 12 tracks from the database
        if (!zipCode) {
            const tracks = await Track.find().limit(12).lean();
            return NextResponse.json(tracks); // Return response immediately
        }

        // Get the latitude and longitude of the user-provided zip code
        const userLocation = await geocodeZipCode(zipCode);
        if (!userLocation) {
            return NextResponse.json({ message: 'No tracks found in this area' }, { status: 200 }); // No geocoding result, but continue with empty result
        }

        // Convert radius to meters (1 mile = 1609.34 meters)
        const radiusInMeters = radius * 1609.34;

        // Query the database for tracks within the radius
        const tracks = await Track.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: userLocation
                            ? [userLocation.lng, userLocation.lat]  // [longitude, latitude] if geocoding was successful
                            : [0, 0]  // Default coordinates if geocoding failed (can adjust as needed)
                    },
                    $maxDistance: radiusInMeters  // Use radius in meters
                }
            }
        }).lean();

        // If no tracks are found, return a custom message
        if (tracks.length === 0) {
            return NextResponse.json({ message: 'No tracks found in this area' }, { status: 200 }); // No tracks in area
        }

        // If tracks are found, return them
        return NextResponse.json(tracks); // Return the tracks found

    } catch (error) {
        console.error('Error fetching tracks:', error);
        return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 }); // Handle unexpected errors
    }
}
