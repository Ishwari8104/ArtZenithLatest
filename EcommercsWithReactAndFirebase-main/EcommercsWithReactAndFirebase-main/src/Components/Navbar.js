import React, { useContext, useState, useEffect } from 'react';
import logo from '../images/artzenith_logo.jpeg';
import { Link } from 'react-router-dom';
import { auth } from '../Config/Config';
import { Icon } from 'react-icons-kit';
import { cart } from 'react-icons-kit/entypo/cart';
import { useHistory } from 'react-router-dom';
import { CartContext } from '../Global/CartContext';
import { AddProducts } from './AddProducts'; 
import { AddArtist } from './AddArtist';
import { fs } from '../Config/Config';

export const Navbar = ({ user }) => {
    const history = useHistory();
    const { totalQty } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

    // handle logout
    const handleLogout = () => {
        auth.signOut().then(() => {
            history.push('/login');
        });
    };

    useEffect(() => {
        if (user === null) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Perform search as the user types
        if (query.trim() !== '') {
            setSearchDropdownOpen(true);
            performSearch(query);
        } else {
            setSearchDropdownOpen(false);
            setSearchResults([]);
        }
    };

    const performSearch = (query) => {
        // Implement your Firestore search logic here
        // For example, search for both products and artists based on query
        // You may need to customize the Firestore queries for your database structure
        fs.collection('Products')
            .where('title', '>=', query) // Search for products with a title containing the query
            .limit(5)
            .get()
            .then((productQuerySnapshot) => {
                const productResults = productQuerySnapshot.docs.map((doc) => ({
                    type: 'Product',
                    id: doc.id,
                    ...doc.data(),
                }));

                fs.collection('Artists')
                    .where('name', '>=', query) // Search for artists with a name containing the query
                    .limit(5)
                    .get()
                    .then((artistQuerySnapshot) => {
                        const artistResults = artistQuerySnapshot.docs.map((doc) => ({
                            type: 'Artist',
                            id: doc.id,
                            ...doc.data(),
                        }));

                        // Combine and set the results
                        setSearchResults([...productResults, ...artistResults]);
                    });
            })
            .catch((error) => {
                console.error('Error searching Firestore:', error);
            });
    };

    return (
        <div className='navbox'>
            <div className='leftside'>
                <img src={require('../images/artzenith_logo.jpeg')} alt="" style={{ width: '200px' }} />
            </div>
            {isLoading ? (
                <div className='rightside'>Loading...</div>
            ) : (
                <>
                <div className='center'>
                        <input
                            type='text'
                            placeholder='Search...'
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        {searchDropdownOpen && (
                            <div className='search-dropdown'>
                                {searchResults.map((result) => (
                                    <div key={result.id} className='search-item'>
                                        {result.type === 'Product' ? (
                                            <Link to={`/product/${result.id}`}>{result.title}</Link>
                                        ) : (
                                            <Link to={`/artist/${result.id}`}>{result.name}</Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {!user && (
                        <div className='rightside'>
                            <span><Link to="signup" className='navlink'>SIGN UP</Link></span>
                            <span><Link to="login" className='navlink'>LOGIN</Link></span>
                        </div>
                    )}
                    {user && (
                        <div className='rightside'>
                            <span><Link to="/" className='navlink'>{user}</Link></span>
                            <span><Link to="cartproducts" className='navlink'><Icon icon={cart} /></Link></span>
                            <span className='no-of-products'>{totalQty}</span>
                            {/* Add the "Add Product" button with a link to the AddProducts component */}
                            <span><Link to="/addproducts" className='navlink'>Add Piece</Link></span>
                            <span><Link to="/addartist" className='navlink'>Add Profile</Link></span>
                            <span><Link to="/mostlikedart" className='navlink'>Most Liked Art</Link></span>
                            <span><button className='logout-btn' onClick={handleLogout}>Logout</button></span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
