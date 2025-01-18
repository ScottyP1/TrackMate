import Inbox from '@/lib/models/Inbox';
import mongoose from 'mongoose';
import User from '@/lib/models/User';


export async function POST(req) {
    try {
        // Get the sender, receiver, and other details from the request body
        const { senderEmail, receiverEmail, text, conversationId } = await req.json();

        if (!senderEmail || !receiverEmail || !text) {
            return new Response('Missing required fields', { status: 400 });
        }

        let sender;
        let receiver;
        let conversationIdToUse = conversationId;

        // If conversationId exists, fetch the first message in the conversation
        if (conversationId) {
            const existingConversation = await Inbox.find({ conversationId }).sort({ createdAt: 1 }).limit(1);

            if (existingConversation.length > 0) {
                // Get the first message from the conversation
                const firstMessage = existingConversation[0];

                // Get the senderId and receiverId from the first message
                const firstSenderId = firstMessage.senderId;
                const firstReceiverId = firstMessage.receiverId;

                // Now fetch the sender and receiver using the IDs to get their emails
                sender = await User.findById(firstSenderId);
                receiver = await User.findById(firstReceiverId);

                if (!sender || !receiver) {
                    return new Response('Sender or receiver not found in the database', { status: 404 });
                }

                // Check if the incoming senderEmail matches the email of the first sender or receiver
                if (sender.email === senderEmail) {
                    // If the senderEmail matches the first sender, use the first sender and receiver as is
                    sender = sender;
                    receiver = receiver;
                } else {
                    const temp = sender;
                    sender = receiver;
                    receiver = temp;
                }
            }
        } else {
            // If no conversationId exists, look up the users by their emails
            sender = await User.findOne({ email: senderEmail });
            receiver = await User.findOne({ email: receiverEmail });

            if (!sender || !receiver) {
                return new Response('Invalid sender or receiver', { status: 400 });
            }

            // Create a new conversationId based on the sender and receiver IDs
            const sortedUserIds = [sender._id, receiver._id].sort();
            conversationIdToUse = sortedUserIds.join('-');
        }

        // Create a new message with the correct senderId and receiverId
        let newMessage = new Inbox({
            senderId: sender._id,   // Sender is the one sending the message
            receiverId: receiver._id, // Receiver is the one receiving the message
            text,
            conversationId: conversationIdToUse,
            isRead: false,  // Default to unread
        });

        // Save the new message to the database
        await newMessage.save();

        // Return the new message as a response
        return new Response(JSON.stringify(newMessage), { status: 201 });

    } catch (error) {
        console.error('Error sending message:', error);
        return new Response('Error sending message', { status: 500 });
    }
}


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        if (!userEmail) {
            return new Response('User email is required', { status: 400 });
        }

        // Find the user by email to get the userId
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        // Get the userId from the found user
        const userId = user._id;

        // Now find all messages where user is either sender or receiver
        const conversations = await Inbox.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(userId) },  // Use 'new' with ObjectId
                        { receiverId: new mongoose.Types.ObjectId(userId) }  // Use 'new' with ObjectId
                    ]
                }
            },
            {
                $group: {
                    _id: "$conversationId",  // Group by conversationId
                    messages: { $push: "$$ROOT" }  // Push all messages for this conversation
                }
            },
            {
                $lookup: {
                    from: "users",  // Assuming the users collection
                    localField: "messages.receiverId",  // Get receiver info
                    foreignField: "_id",
                    as: "receiver"
                }
            },
            {
                $lookup: {
                    from: "users",  // Assuming the users collection
                    localField: "messages.senderId",  // Get sender info
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $unwind: {
                    path: "$receiver",
                    preserveNullAndEmptyArrays: true  // Handle case where receiver might be null
                }
            },
            {
                $unwind: {
                    path: "$sender",
                    preserveNullAndEmptyArrays: true  // Handle case where sender might be null
                }
            },
            {
                $project: {
                    conversationId: "$_id",  // Rename _id to conversationId
                    messages: { $slice: ["$messages", -1] }, // Get the latest message only
                    receiver: {
                        name: "$receiver.name",
                        email: "$receiver.email",
                        profileAvatar: "$receiver.profileAvatar"
                    },
                    sender: {
                        name: "$sender.name",
                        email: "$sender.email",
                        profileAvatar: "$sender.profileAvatar"
                    }
                }
            }
        ]);

        return new Response(JSON.stringify(conversations), { status: 200 });
    } catch (error) {
        console.error('Error fetching inbox:', error);
        return new Response('Error fetching inbox', { status: 500 });
    }
}
