// Artist.js
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ArtistContext } from '../Global/ArtistContext';

export const Artist = () => {
    const { artists } = useContext(ArtistContext);
    const { artistName } = useParams();
    const decodedArtistName = decodeURIComponent(artistName);

    // Find the artist with the specified artistName
    const artist = artists.find((a) => a.ArtistName === decodedArtistName);
// Artist.js
console.log("Decoded Artist Name in Artist:", decodedArtistName);

// Rest of the component code...

    if (!artist) {
        return <div>Artist not found.</div>;
    }

    return (
        <div className='product-details-container'>
            <h1>Artist Profile</h1>
            <h2>{artist.ArtistName}</h2>
            {artist.ArtistImage && (
    <div style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', margin: '0 auto' }}>
        <img
            src={artist.ArtistImage}
            alt={`Image of ${artist.ArtistName}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
        console.log(artist.ArtistImage)
    </div>
)}

            <p>Date of Birth: {artist.DateOfBirth}</p>
            <p>Education: {artist.Education}</p>
            <p>View on Art: {artist.ViewOnArt}</p>
            <p>Inspiration: {artist.Inspiration}</p>
            <p>Idol: {artist.Idol}</p>
        </div>
    );
};
