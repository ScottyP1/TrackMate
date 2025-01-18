import { useContext, useEffect, useState } from 'react';
import { Context as InboxContext } from '@/context/InboxContext';
import { Context as AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Messenger({ conversationId }) {
    const { state: InboxState, fetchMessage, sendMessage } = useContext(InboxContext);
    const { loading, errorMessage, selectedMessage } = InboxState;
    const { state: AuthState } = useContext(AuthContext);
    const [messageText, setMessageText] = useState('');
    const router = useRouter();

    // Redirect if no auth token (ensure user is authenticated)
    useEffect(() => {
        if (!AuthState.token) {
            router.push('/');
        }
        if (conversationId) {
            fetchMessage(conversationId);
        }
    }, [AuthState.token, conversationId, InboxState.selectedMessage.length]);

    const handleSend = async () => {
        if (!messageText.trim()) return;

        const currentUserEmail = AuthState.user?.email?.trim().toLowerCase();
        const otherUserEmail = selectedMessage[0]?.senderId?.email?.trim().toLowerCase() === currentUserEmail
            ? selectedMessage[0]?.receiverId?.email?.trim().toLowerCase()
            : selectedMessage[0]?.senderId?.email?.trim().toLowerCase();

        const senderEmail = currentUserEmail;
        const recipientEmail = otherUserEmail;

        // Ensure the correct `conversationId` is passed
        let conversationId = selectedMessage?.[0]?.conversationId || conversationId;

        // Send the message to the server
        await sendMessage(senderEmail, recipientEmail, messageText, conversationId);
        setMessageText('');
        fetchMessage(conversationId);
    };

    const otherUserEmail = selectedMessage.length > 0 ? (selectedMessage[0]?.senderId?.email !== AuthState.user?.email ? selectedMessage[0]?.senderId?.email : selectedMessage[0]?.receiverId?.email) : null;
    const otherUserName = otherUserEmail ? (selectedMessage[0]?.senderId?.email === otherUserEmail ? selectedMessage[0]?.senderId?.name : selectedMessage[0]?.receiverId?.name) : "Unknown";

    return (
        <div className="relative flex flex-col bg-gradient-to-b from-black via-transparent to-transparent p-4 h-full">
            <div className="flex-grow overflow-auto">
                {/* Display the other person's name */}
                <h1 className="text-4xl font-semibold text-center text-white mb-6 animate-fade-in">
                    {otherUserName}
                </h1>

                {/* Message list */}
                <div className="space-y-4 bg-black/50 rounded-xl p-6 mb-24 overflow-y-scroll max-h-[70vh]">
                    {selectedMessage.map((msg) => {
                        const isCurrentUserMessage = msg.senderId.email.toLowerCase() === AuthState.user?.email?.toLowerCase();
                        return (
                            <div
                                key={msg._id}
                                className={`flex items-start space-x-4 w-full ${isCurrentUserMessage ? 'justify-end' : ''}`}
                            >
                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[100%] px-5 py-3 shadow-md rounded-lg ${isCurrentUserMessage
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' // for current user's message bubble
                                        : 'bg-gray-800 text-white' // for other user's message bubble
                                        }`}
                                >
                                    {/* Flex container for message content */}
                                    <div className={`flex items-center ${isCurrentUserMessage ? 'flex-row-reverse' : ''} space-x-3`}>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Input field */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] lg:w-[80%] p-4 flex items-center bg-gray-800 bg-opacity-80 rounded-full border-t border-neutral-600 shadow-lg">
                <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full h-14 p-4 rounded-lg text-gray-700 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                    onClick={handleSend}
                    className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
