import { createContext, useContext, useState } from "react";

// Create the context
const CartContext = createContext();

// Export a hook for convenience
export function useCart() {
  return useContext(CartContext);
}

// Context provider component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  // Provide value
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
