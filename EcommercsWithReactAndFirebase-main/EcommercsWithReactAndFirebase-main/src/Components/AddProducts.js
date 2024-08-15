import React, { useState, useEffect } from 'react';
import { storage, fs, auth } from '../Config/Config';
import { useHistory } from 'react-router-dom';

export const AddProducts = () => {
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [size, setSize] = useState('');
    const [createdIn, setCreatedIn] = useState('');
    const [canvas, setCanvas] = useState('');
    const [artistName, setArtistName] = useState('');
    const [style, setStyle] = useState('');
    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

    const handleProductImg = (e) => {
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

    const handleAddProducts = (e) => {
        e.preventDefault();

        const uploadTask = storage.ref(`product-images/${image.name}`).put(image);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        }, (error) => {
            console.error('Storage Error:', error);
            setUploadError(error.message);
        }, () => {
            storage.ref('product-images').child(image.name).getDownloadURL().then((url) => {
                fs.collection('Products').add({
                    title,
                    description,
                    price: Number(price),
                    size,
                    createdIn,
                    canvas,
                    artistName,
                    style,
                    url,
                }).then(() => {
                    setSuccessMsg('Product added successfully');
                    setTitle('');
                    setDescription('');
                    setPrice('');
                    setSize('');
                    setCreatedIn('');
                    setCanvas('');
                    setArtistName('');
                    setStyle('');
                    document.getElementById('file').value = '';
                    setImageError('');
                    setUploadError('');
                    setTimeout(() => {
                        setSuccessMsg('');
                        // history.push('/products'); // Redirect to the home page
                    }, 3000);
                }).catch((error) => {
                    console.error('Firestore Error:', error);
                    setUploadError(error.message);
                });
            });
        });
    };

    return (
        <div className='container'>
            <br />
            <br />
            <h1>Add Piece</h1>
            <hr />
            {successMsg && (
                <>
                    <div className='success-msg'>{successMsg}</div>
                    <br />
                </>
            )}
            <form autoComplete='off' className='form-group' onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                ></input>
                <br />
                <label>Product Description</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></input>
                <br />
                <label>Product Price</label>
                <input
                    type='number'
                    className='form-control'
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                ></input>
                <br />
                <label>Size</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setSize(e.target.value)}
                    value={size}
                ></input>
                <br />
                <label>Created In</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setCreatedIn(e.target.value)}
                    value={createdIn}
                ></input>
                <br />
                <label>Canvas</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setCanvas(e.target.value)}
                    value={canvas}
                ></input>
                <br />
                <label>Artist Name</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setArtistName(e.target.value)}
                    value={artistName}
                    readOnly
                ></input>
                <br />
                <label>Style</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setStyle(e.target.value)}
                    value={style}
                ></input>
                <br />
                <label>Upload Product Image</label>
                <input
                    type='file'
                    id='file'
                    className='form-control'
                    required
                    onChange={handleProductImg}
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
