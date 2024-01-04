// src/components/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/Style.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        console.log('Response:', response);
        console.log('Fetched products:', data);

        if (Array.isArray(data.products)) {
          dispatch({ type: 'SET_PRODUCTS', payload: data.products });
          console.log('Products dispatched:', data.products);
        } else {
          console.error('Invalid data structure received from API:', data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setAddedToCart((prevAddedToCart) => ({
      ...prevAddedToCart,
      [product.id]: true,
    }));

    // Clear the added status after 3 seconds
    setTimeout(() => {
      setAddedToCart((prevAddedToCart) => ({
        ...prevAddedToCart,
        [product.id]: false,
      }));
    }, 3000);
  };

  return (
    <div>
      <nav className="Nav">
        <Link to="/">Shopping Cart</Link>
        <div className="nav-links">
          <Link to="/">Homepage</Link>
          <Link to="/cart">CartPage</Link>
        </div>
      </nav>
      <h2 className="page-heading">All Items</h2>
      <div className="product-container">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className={`product-item ${addedToCart[product.id] ? 'added-to-cart' : ''}`}
            >
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
              {addedToCart[product.id] && (
                <p className="added-to-cart-text show">Added to Cart</p>
              )}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;