import React, { createContext, useEffect, useState } from 'react';
import { fs } from '../Config/Config';

export const ArtistContext = createContext();

export const ArtistContextProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const prevArtists = [];

        const unsubscribe = fs.collection('Artists').onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach((change) => {
                if (change.type === 'added') {
                    prevArtists.push({
                        ArtistID: change.doc.id,
                        ArtistName: change.doc.data().artistName,
                        DateOfBirth: change.doc.data().dateOfBirth,
                        Education: change.doc.data().education,
                        Idol: change.doc.data().idol,
                        ArtistImage: change.doc.data().imageUrl,
                        Inspiration: change.doc.data().inspiration,
                        ViewOnArt: change.doc.data().viewOnArt,
                    });
                }
            });

            setArtists([...prevArtists]);
        });

        return () => unsubscribe();
    }, []);

    return (
        <ArtistContext.Provider value={{ artists }}>
            {children}
        </ArtistContext.Provider>
    );
};
