import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load the cart from localStorage if it already exists
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Every time the cart changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add a product to the cart
const addToCart = (product) => {
  setCartItems((prevItems) => {
    const productId = product.id_product;
    
    const isItemInCart = prevItems.find((item) => item.id_product === productId);

    if (isItemInCart) {
      return prevItems.map((item) =>
        item.id_product === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prevItems, { ...product, quantity: 1 }];
  });
};

  // 2. Decrease quantity or remove the product
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id_product === productId) {
          if (item.quantity === 1) return acc; // Remove the product completely
          return [...acc, { ...item, quantity: item.quantity - 1 }];
        }
        return [...acc, item];
      }, [])
    );
  };

  // 3. Remove the product at once (Delete button)
  const deleteItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id_product !== productId));
  };

  // 4. Calculate total item count in the cart (for the Navbar badge)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 5. Calculate total price
  const cartTotal = cartItems.reduce((total, item) => total + item.prix * item.quantity, 0);

  // 6. Clear the entire cart (for example, after checkout)
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, deleteItem, cartCount, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to make usage easier in other files
export const useCart = () => useContext(CartContext);
