'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Context as InboxContext } from '@/context/InboxContext';
import Cookies from 'js-cookie';

export default function InboxPage() {
    const { state, fetchInbox } = useContext(InboxContext);
    const { inbox, loading, errorMessage } = state;

    const router = useRouter();
    const userEmail = Cookies.get('userEmail');

    useEffect(() => {
        if (!userEmail) {
            router.push('/Login');  // Redirect to login if userEmail is not found
        } else {
            fetchInbox(userEmail);  // Fetch inbox messages
        }
    }, [inbox.messages]);

    // Group the conversations by conversationId to make sure there is only one thread per conversation
    const groupedConversations = inbox.reduce((acc, conversation) => {
        const existingConvo = acc.find((convo) => convo.conversationId === conversation.conversationId);

        if (existingConvo) {
            // If conversation already exists, merge messages (only the most recent one)
            existingConvo.messages = [...existingConvo.messages, ...conversation.messages];
        } else {
            // Otherwise, add new conversation
            acc.push(conversation);
        }

        return acc;
    }, []);


    return (
        <div className="mx-auto mt-16 bg-gradient-to-b from-black/[.8] via-transparent to-transparent relative p-12 shadow-xl">
            <div className="h-screen">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white mb-6 tracking-tight animate-fade-in">
                    Inbox
                </h1>

                {loading && <div className="text-center">Loading messages...</div>}
                {errorMessage && <div className="text-center bg-red-600 text-white p-3 rounded-lg mb-4">{errorMessage}</div>}

                <div className="inbox-list space-y-4 max-w-5xl mx-auto">
                    {groupedConversations.length > 0 ? (
                        groupedConversations.map((conversation) => {
                            // Grab the first message's sender (this will be consistent across the conversation)
                            return (
                                <div
                                    key={conversation.conversationId} // Unique key per conversation
                                    className="bg-gradient-to-t transition-all transform hover:translate-y-[-5px] hover:shadow-2xl hover:border-blue-500 duration-300 from-black/[.7] via-transparent to-transparent shadow-2xl flex items-center space-x-4 p-4 rounded-lg border-2 border-blue-300"
                                >
                                    {/* Show sender's avatar from the first message */}
                                    <Image
                                        src={conversation.receiver.email === Cookies.get('userEmail') ? conversation.sender.profileAvatar : conversation.receiver.profileAvatar}
                                        alt={conversation.receiver.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />

                                    <div className="flex-grow">
                                        <Link href={`/Inbox/${conversation.conversationId}`}>
                                            <div className="font-semibold">{conversation.receiver.name}</div>
                                            <div className="text-gray-500 text-sm mt-1">
                                                {/* Render the latest message in the conversation */}
                                                {conversation.messages && conversation.messages.length > 0 &&
                                                    conversation.messages[conversation.messages.length - 1]?.text}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="mt-16 text-center">No conversations available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
