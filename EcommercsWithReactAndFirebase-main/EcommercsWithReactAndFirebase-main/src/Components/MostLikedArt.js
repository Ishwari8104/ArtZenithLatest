import React, { useContext } from 'react';
import { LikesContext } from '../Global/LikesContext';
import { ProductsContext } from '../Global/ProductsContext';
import { Link } from 'react-router-dom';
import { CartContext } from '../Global/CartContext';
import './MostLikedArt.css'; 
import { Navbar } from './Navbar'; // Import the Navbar component

export const MostLikedArt = ({ user }) => {
    const { products } = useContext(ProductsContext);
    const { likesData } = useContext(LikesContext);
    const { dispatch } = useContext(CartContext);

    // Sort products by likes based on the likesData from LikesContext
    const sortedProducts = [...products].sort(
        (a, b) => (likesData[b.ProductID] || 0) - (likesData[a.ProductID] || 0)
    );

    return (
        <div className='most-liked-art-container'>
            <Navbar user={user}/>
        <div className='products-container'>
            {sortedProducts.length === 0 && <div>No products to display.</div>}
            {sortedProducts.map((product) => (
                <div className='product-card' key={product.ProductID}>
                    <div className='product-img'>
                        <img src={product.ProductImg} alt="Product" />
                    </div>
                    <Link to={`/product/${product.ProductID}`} style={{ textAlign: 'center', display: 'block' }}>
                        <div className='product-name'>{product.ProductName}</div>
                    </Link>
                    <div className='product-price'>Rs {product.ProductPrice}.00</div>
                    <p>Likes: {likesData[product.ProductID] || 0}</p>
                    <button
                        className='addcart-btn'
                        onClick={() => dispatch({ type: 'ADD_TO_CART', id: product.ProductID, product })}
                    >
                        ADD TO CART
                    </button>
                </div>
            ))}
        </div>
        </div>
    );
};

export default MostLikedArt;
