import React, { useState } from 'react';
import { auth, fs } from '../Config/Config';
import { Link } from 'react-router-dom';
import './Signup.css'; 
export const Signup = (props) => {
    // defining state
    const [artistName, setArtistName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // signup
    const signup = (e) => {
        e.preventDefault();
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((cred) => {
                // After successfully creating the user, set their displayName
                cred.user
                    .updateProfile({
                        displayName: artistName, // Set the artistName as the displayName
                    })
                    .then(() => {
                        fs.collection('SignedUpUsersData')
                            .doc(cred.user.uid)
                            .set({
                                Name: artistName, // Store artistName in Firestore as Name
                                Email: email,
                                Password: password,
                            })
                            .then(() => {
                                setArtistName('');
                                setEmail('');
                                setPassword('');
                                setError('');
                                props.history.push('/login');
                            })
                            .catch((err) => setError(err.message));
                    })
                    .catch((err) => setError(err.message));
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className='container'>
            <br />
            <h2>Sign up</h2>
            <br />
            <form autoComplete='off' className='form-group' onSubmit={signup}>
                <label htmlFor='artistName' className='auth-label'>Name</label>
                <input
                    type='text'
                    className='auth-input'
                    required
                    onChange={(e) => setArtistName(e.target.value)}
                    value={artistName}
                />
                <br />
                <label htmlFor='email' className='auth-label'>Email</label>
                <input
                    type='email'
                    className='auth-input'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <br />
                <label htmlFor='password' className='auth-label'>Password</label>
                <input
                    type='password'
                    className='auth-input'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <br />
                <button type='submit' className='btn btn-success btn-md mybtn'>
                    SUBMIT
                </button>
            </form>
            {error && <span className='error-msg'>{error}</span>}
            <br />
            <span className='auth-link'>
                Already have an account? Login
                <Link to='login'> Here</Link>
            </span>
        </div>
    );
};
