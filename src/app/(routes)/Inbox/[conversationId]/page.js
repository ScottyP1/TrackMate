'use client';

import { useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Context as InboxContext } from '@/context/InboxContext';

import Messenger from '@/components/Messenger';

export default function ConversationPage() {
    const { fetchMessage, state } = useContext(InboxContext);
    const { loading, selectedMessage, errorMessage } = state;

    const pathname = usePathname();
    let conversationId = pathname ? pathname.split('/').pop() : null;

    useEffect(() => {
        if (conversationId) {
            fetchMessage(conversationId);  // Fetch the full conversation thread by its ID
        }
    }, [conversationId]);  // Make sure to add `conversationId` as a dependency

    if (loading) {
        return <p className='mt-16'>Loading conversation...</p>;
    }

    if (errorMessage) {
        return <p className='mt-16'>{errorMessage}</p>;
    }
    return (
        <div className="mt-16">
            {selectedMessage && (
                <Messenger conversation={selectedMessage} />  // Pass selectedMessage, which contains the full conversation
            )}
        </div>
    );
}
