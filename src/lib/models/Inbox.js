const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    conversationId: { type: String, required: true },
    parentMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inbox' },  // To track replies
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },  // To track whether the message is read
});

// Ensure conversationId is unique for each conversation (only if it doesn't already exist)
if (!inboxSchema.path('conversationId').options.index) {
    inboxSchema.index({ conversationId: 1 });
}

// Create the Inbox model
const Inbox = mongoose.models.Inbox || mongoose.model('Inbox', inboxSchema);

module.exports = Inbox;
