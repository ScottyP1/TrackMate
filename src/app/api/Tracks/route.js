import Track from '@/lib/models/Track';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { dbConnect } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zipCode');
    const trackName = searchParams.get('trackName');
    let radius = searchParams.get('radius');

    // Validate zipCode and radius
    if (!zipCode && !trackName) {
        return NextResponse.json({ message: 'Please provide a track name or zip code.' }, { status: 400 });
    }

    if (radius && (isNaN(radius) || radius <= 0)) {
        return NextResponse.json({ message: 'Invalid radius. It must be a positive number.' }, { status: 400 });
    }

    if (zipCode && !/^\d{5}$/.test(zipCode)) {  // Check if zipCode is a valid 5-digit number
        return NextResponse.json({ message: 'Invalid zip code format.' }, { status: 400 });
    }

    // Set default radius if not provided
    if (!radius) {
        radius = 50; // Default radius in miles
    }

    try {
        await dbConnect();  // Ensure the database connection is established

        // If no zip code or track name is provided, return the first 12 tracks from the database
        if (!zipCode && !trackName) {
            const tracks = await Track.find().limit(12).lean();
            return NextResponse.json(tracks); // Return response immediately
        }

        // If search is by track name
        if (trackName) {
            const sanitizedTrackName = escapeRegExp(trackName); // Escape any special regex characters
            const tracks = await Track.find({
                name: { $regex: sanitizedTrackName, $options: 'i' } // Case-insensitive search
            }).lean();

            if (tracks.length === 0) {
                return NextResponse.json({ message: 'No tracks found with that name' }, { status: 404 });
            }
            return NextResponse.json(tracks);
        }

        // If search is by zip code, perform the geocoding and radius search
        const userLocation = await geocodeZipCode(zipCode);
        if (!userLocation) {
            return NextResponse.json({ message: 'No tracks found in this area' }, { status: 404 });
        }

        const radiusInMeters = radius * 1609.34;  // Convert radius to meters
        const tracks = await Track.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLocation.lng, userLocation.lat]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }).lean();

        if (tracks.length === 0) {
            return NextResponse.json({ message: 'No tracks found in this area' }, { status: 404 });
        }

        return NextResponse.json(tracks);

    } catch (error) {
        console.error('Error fetching tracks:', error);
        return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }
}

// Geocoding function to get latitude and longitude from zip code
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

// Escape regex special characters in the track name
function escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}
