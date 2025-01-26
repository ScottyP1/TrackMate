import { useContext, useEffect } from 'react';
import { Context as AuthContext } from '@/context/AuthContext';
import Link from 'next/link';

export default function FriendCard({ friend }) {
    const { state, fetchOtherUserProfile } = useContext(AuthContext);

    useEffect(() => {
        // Trigger the action to fetch the friend's profile
        fetchOtherUserProfile(friend);  // Assuming `email` is used as identifier
    }, []);

    let user = state.visitedUser;

    return (
        <div className="bg-black/[.8] p-6 rounded-lg shadow-lg cursor-pointer">
            <Link href={`Account/${user?._id}`}>
                <div className="flex flex-col items-center">
                    <img
                        src={user?.profileAvatar || '/default-avatar.png'}
                        alt={user?.name}
                        className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full border-2 border-blue-500"
                    />
                    <h3 className="text-white mt-4">{user?.name}</h3>
                </div>
            </Link>
        </div>
    );
}
