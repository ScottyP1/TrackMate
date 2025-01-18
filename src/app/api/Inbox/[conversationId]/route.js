import Inbox from '@/lib/models/Inbox';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
    const { conversationId } = await params;
    if (!conversationId) {
        return new Response('Conversation ID is required', { status: 400 });
    }

    try {
        // Fetch all messages that belong to the given conversationId
        const conversationMessages = await Inbox.find({ conversationId })
            .populate('senderId receiverId')
            .sort({ createdAt: 1 });  // Ensure messages are sorted in the correct order

        return new Response(JSON.stringify(conversationMessages), { status: 200 });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return new Response('Error fetching conversation', { status: 500 });
    }
}
