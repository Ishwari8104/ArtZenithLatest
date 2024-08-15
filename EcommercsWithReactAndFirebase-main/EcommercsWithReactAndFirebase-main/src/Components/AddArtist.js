import React, { useState, useEffect } from 'react';
import { storage, fs, auth } from '../Config/Config';
import { useHistory } from 'react-router-dom';

export const AddArtist = () => {
    const history = useHistory();

    const [artistName, setArtistName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [education, setEducation] = useState('');
    const [viewOnArt, setViewOnArt] = useState('');
    const [inspiration, setInspiration] = useState('');
    const [idol, setIdol] = useState('');
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

    const handleArtistImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');
            } else {
                setImage(null);
                setImageError('Please select a valid image file type (png or jpg)');
            }
        } else {
            console.log('Please select your file');
        }
    };

    useEffect(() => {
        // Fetch the currently logged-in user's information
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Set the artistName to the user's "displayName" field
                setArtistName(user.displayName || '');
            } else {
                // Clear the artistName if the user is not logged in
                setArtistName('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAddArtist = (e) => {
        e.preventDefault();

        const uploadTask = storage.ref(`artist-images/${image.name}`).put(image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            },
            (error) => {
                console.error('Storage Error:', error);
                setUploadError(error.message);
            },
            () => {
                storage
                    .ref('artist-images')
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        fs.collection('Artists')
                            .add({
                                artistName,
                                dateOfBirth,
                                education,
                                viewOnArt,
                                inspiration,
                                idol,
                                imageUrl: url, // Add the image URL to the artist data
                            })
                            .then(() => {
                                setSuccessMsg('The artist has been added.');
                                setArtistName('');
                                setDateOfBirth('');
                                setEducation('');
                                setViewOnArt('');
                                setInspiration('');
                                setIdol('');
                                document.getElementById('file').value = '';
                                setImageError('');
                                setUploadError('');
                                setTimeout(() => {
                                    setSuccessMsg('');
                                    history.push('/'); // Redirect to the home page
                                }, 3000);
                            })
                            .catch((error) => {
                                console.error('Firestore Error:', error);
                                setUploadError(error.message);
                            });
                    });
            }
        );
    };

    return (
        <div className='container'>
            <br />
            <br />
            <h1>Add Profile</h1>
            <hr />
            {successMsg && (
                <>
                    <div className='success-msg'>{successMsg}</div>
                    <br />
                </>
            )}
            <form autoComplete='off' className='form-group' onSubmit={handleAddArtist}>
                <label>Name</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setArtistName(e.target.value)}
                    value={artistName}
                    readOnly
                ></input>
                <label>Date of Birth</label>
                <input
                    type='date'
                    className='form-control'
                    required
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    value={dateOfBirth}
                ></input>
                <label>Education Qualification</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setEducation(e.target.value)}
                    value={education}
                ></input>
                <label>View on Art</label>
                <textarea
                    className='form-control'
                    required
                    onChange={(e) => setViewOnArt(e.target.value)}
                    value={viewOnArt}
                ></textarea>
                <label>Inspiration</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setInspiration(e.target.value)}
                    value={inspiration}
                ></input>
                <label>Idol</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setIdol(e.target.value)}
                    value={idol}
                ></input>
                <label>Upload Artist Image</label>
                <input
                    type='file'
                    id='file'
                    className='form-control'
                    required
                    onChange={handleArtistImg}
                ></input>

                {imageError && (
                    <>
                        <br />
                        <div className='error-msg'>{imageError}</div>
                    </>
                )}
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type='submit' className='btn btn-success btn-md'>
                        SUBMIT
                    </button>
                </div>
            </form>
            {uploadError && (
                <>
                    <br />
                    <div className='error-msg'>{uploadError}</div>
                </>
            )}
        </div>
    );
};
