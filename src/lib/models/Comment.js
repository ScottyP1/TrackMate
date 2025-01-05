const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' },
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String }, // Add name for main comment
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the comment
    replies: [{
        text: { type: String, required: true },  // Ensures that reply text is required
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who made the reply
        name: { type: String }, // Name for replies
        createdAt: { type: Date, default: Date.now }, // Timestamp for the reply
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the reply
    }],
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
