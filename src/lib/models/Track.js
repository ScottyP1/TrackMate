import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        images: { type: [String], default: ['https://via.placeholder.com/300x300?text=No+Image'] },  // Store up to 10 images
        rating: { type: Number, default: 0 },
        placeId: { type: String, unique: true },
        website: { type: String, required: false },
        openingHours: { type: Boolean, default: null },
        logo: { type: String, default: 'https://via.placeholder.com/300x300?text=No+Logo' },  // Store the logo URL
    },
    { timestamps: true }
);

const Track = mongoose.models.Track || mongoose.model('Track', trackSchema);

export default Track;
