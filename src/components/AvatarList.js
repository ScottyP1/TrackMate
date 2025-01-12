import { useState } from 'react';
import Image from 'next/image';

import dino from 'public/Avatars/dino.png';
import dirtbike from 'public/Avatars/dirtbike.png';
import duck from 'public/Avatars/duck.png';
import monster from 'public/Avatars/monster.png';
import ninja from 'public/Avatars/ninja.png';
import panda from 'public/Avatars/panda.png';
import racer from 'public/Avatars/racer.png';
import shark from 'public/Avatars/shark.png';

export default function AvatarList({ onSelect, classes }) {
    const [selectedAvatar, setSelectedAvatar] = useState(null); // Track selected avatar

    const images = [dino, dirtbike, duck, monster, ninja, panda, racer, shark];

    const handleSelect = (image) => {
        setSelectedAvatar(image); // Update local state
        onSelect(image); // Notify parent component
    };

    return (
        <div className="grid grid-cols-4 gap-4">
            {images.map((image) => (
                <div
                    key={image.src}
                    className={`${classes} p-2 rounded-full border-2 ${selectedAvatar === image ? 'border-blue-500 bg-blue-100' : 'border-gray-400'
                        }`}
                    onClick={() => handleSelect(image)}
                >
                    <Image
                        src={image}
                        width={50}
                        height={50}
                        alt="Avatar"
                        className="cursor-pointer"
                    />
                </div>
            ))}
        </div>
    );
}
