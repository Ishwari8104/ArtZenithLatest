// Home.js
import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Products } from './Products';
import { useHistory } from 'react-router-dom';
import { auth } from '../Config/Config';
import './home.css';

export const Home = ({ user }) => {
    const history = useHistory();

    useEffect(() => {
        // Force the user to sign up
        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/login');
            }
        });
    }, []);

    return (
        <div className='wrapper'>
            <div className='home-background'>
                <Navbar user={user} />
                <Products />
            </div>
        </div>
    );
};