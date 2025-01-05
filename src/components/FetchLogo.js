'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

const TrackLogo = ({ websiteUrl }) => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                // Clean the URL (remove 'http://', 'www.', and trailing slashes)
                const cleanUrl = websiteUrl && websiteUrl
                    .replace(/^https?:\/\//, '') // Remove http:// or https://
                    .replace(/^www\./, '') // Remove www.
                    .replace(/\/$/, ''); // Remove trailing slash

                const response = await fetch(`https://api.brandfetch.io/v2/brands/${cleanUrl}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BRANDFETCH_API_KEY}`,
                    },
                });

                const data = await response.json();

                // Assuming the response contains a 'logo' field
                if (data && data.logos) {
                    setLogoUrl(data.logos[0].formats[0].src);
                }

                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        fetchLogo();
    }, [websiteUrl]);

    if (loading) {
        return <p>Loading logo...</p>;
    }

    return (
        <div>
            {logoUrl ? (
                <Link href={websiteUrl}>
                    <img src={logoUrl} alt={`${websiteUrl} logo`} className='w-[400px] mx-auto' />
                </Link>
            ) : (
                null
            )}
        </div>
    );
};

export default TrackLogo;
