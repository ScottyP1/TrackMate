import { NextResponse } from 'next/server';
import Track from '@/lib/models/Track';
import NotFound from '@/app/not-found';
import { dbConnect } from '@/lib/db'; // Import the dbConnect function

export async function GET(req, { params }) {
    const { placeId } = await params; // Track's placeID
    try {
        await dbConnect(); // Ensure the database connection is established before handling the request

        // Fetch track details using placeID
        const track = await Track.findOne({ placeId }); // Query by placeID
        if (!track) {
            return NextResponse.json(
                { error: 'Track not found' },
                { status: 404 }
            );
        }

        // Build the response
        const trackDetails = {
            id: track._id,
            placeId: track.placeId,
            logo: track.logo,
            name: track.name,
            website: track.website,
            address: track.location,
            images: track.images.length > 0
                ? track.images
                : ['https://via.placeholder.com/300x300?text=No+Image'],
            rating: track.rating || 'N/A',
        };
        return NextResponse.json(trackDetails);
    } catch (error) {
        console.error('Error fetching track details:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching track details.' },
            { status: 500 }
        );
    }
}
