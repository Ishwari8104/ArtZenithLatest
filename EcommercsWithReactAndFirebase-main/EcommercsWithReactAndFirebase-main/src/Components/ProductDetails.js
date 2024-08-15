import React, { useContext } from 'react';
import { ProductsContext } from '../Global/ProductsContext';
import { useParams } from 'react-router-dom';
import './Style.css'; // Import your CSS file
import { Link } from 'react-router-dom';

export const ProductDetails = () => {
  const { products } = useContext(ProductsContext);
  const { id } = useParams(); // Get the product ID from the URL params

  // Find the product with the matching ID
  const product = products.find((product) => product.ProductID === id);

  if (!product) {
    return <div>Product not found</div>;
  }
  console.log("Artist Name in ProductDetails:", product.ArtistName);
  return (
    <div className="product-details-container">
      <h1>{product.ProductName}</h1>
      <div className="product-details">
        <img src={product.ProductImg} alt={product.ProductName} className="product-img-details" />

        <div className="product-info">
          <p>Price: Rs {product.ProductPrice}.00</p>
          {/* Add a link to the artist's profile */}
          <p>Artist: <Link to={`/artist/${encodeURIComponent(product.ArtistName)}`}>{product.ArtistName}</Link></p>

          <p>Canvas: {product.Canvas}</p>
          <p>Created In: {product.CreatedIn}</p>
          <p>Description: {product.Description}</p>
          <p>Size: {product.Size}</p>
          <p>Style: {product.Style}</p>
        </div>
      </div>
      {/* Add an "Add to Cart" button here if needed */}
    </div>
  );
};