import React, { useContext, useState, useEffect } from 'react';
import { ProductsContext } from '../Global/ProductsContext';
import { CartContext } from '../Global/CartContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { fs } from '../Config/Config';
import { LikesContext } from '../Global/LikesContext'; // Import LikesContext

export const Products = () => {
    const { products } = useContext(ProductsContext);
    const { dispatch } = useContext(CartContext);
    const { likesData } = useContext(LikesContext); // Use LikesContext to access likes data

    // Initialize likes state
    const [likes, setLikes] = useState({});
    const [likedProducts, setLikedProducts] = useState([]);

    useEffect(() => {
        // Load and set likes data from Firestore
        const likesData = {};

        const unsubscribe = fs.collection('Likes').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const likeData = change.doc.data();
                const productId = likeData.productId;

                if (change.type === 'added') {
                    likesData[productId] = (likesData[productId] || 0) + 1;
                } else if (change.type === 'removed') {
                    likesData[productId] = (likesData[productId] || 0) - 1;
                }
            });

            setLikes(likesData); // Update the likes state
        });

        return () => unsubscribe();
    }, []);

    const handleLike = (productId) => {
        if (!likedProducts.includes(productId)) {
            // Optimistically update the likes state
            setLikedProducts([...likedProducts, productId]);
            setLikes((prevLikes) => ({
                ...prevLikes,
                [productId]: (prevLikes[productId] || 0) + 1,
            }));
    
            // Add a like to the product in Firestore
            fs.collection('Likes')
                .add({
                    productId: productId,
                })
                .catch((error) => {
                    console.error('Error adding like: ', error);
                    // If the Firestore operation fails, revert the local state
                    setLikedProducts(likedProducts.filter((id) => id !== productId));
                    setLikes((prevLikes) => ({
                        ...prevLikes,
                        [productId]: (prevLikes[productId] || 0) - 1,
                    }));
                });
        }
    };
    

    return (
        <>
            <div className='head'>
                {products.length !== 0 && <h1>Art Works</h1>}
            </div>
            <div className='products-container'>
                {products.length === 0 && <div>Slow internet... No products to display.</div>}
                {products.map((product) => (
                    <div className='product-card' key={product.ProductID}>
                        <div className='product-img'>
                            <img src={product.ProductImg} alt="Product" />
                        </div>
                        <Link to={`/product/${product.ProductID}`} style={{ textAlign: 'center', display: 'block' }}>
                            <div className='product-name'>{product.ProductName}</div>
                        </Link>
                        <div className='product-price'>Rs {product.ProductPrice}.00</div>
                        <div className='like-btn'>
                            <button onClick={() => handleLike(product.ProductID)}>
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <span>{likes[product.ProductID] || 0}</span> {/* Display likes count */}
                        </div>
                        <button
                            className='addcart-btn'
                            onClick={() => dispatch({ type: 'ADD_TO_CART', id: product.ProductID, product })}
                        >
                            ADD TO CART
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};
