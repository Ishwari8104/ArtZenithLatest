// LikesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fs } from '../Config/Config';

export const LikesContext = createContext();

export const LikesContextProvider = ({ children }) => {
    const [likesData, setLikesData] = useState({});

    useEffect(() => {
        const likes = {};

        fs.collection('Likes').onSnapshot((snapshot) => {
            snapshot.docs.forEach((doc) => {
                const likeData = doc.data();
                const productId = likeData.productId;
                likes[productId] = (likes[productId] || 0) + 1;
            });
            setLikesData(likes);
        });

        return () => {
            // Cleanup (if needed)
        };
    }, []);

    return (
        <LikesContext.Provider value={{ likesData }}>
            {children}
        </LikesContext.Provider>
    );
};
