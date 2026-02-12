import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add product to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
     
      const productId = product.id_product || product.id_produit;
      
      const isItemInCart = prevItems.find(
        (item) => (item.id_product || item.id_produit) === productId
      );

      if (isItemInCart) {
        return prevItems.map((item) =>
          (item.id_product || item.id_produit) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Ensure price is converted to a number when first added to cart
      const cleanPrice =
        typeof product.prix === "string"
          ? parseFloat(product.prix.replace(/[^\d.]/g, ""))
          : product.prix;

      return [
        ...prevItems,
        { ...product, id_product: productId, prix: cleanPrice, quantity: 1 }
      ];
    });
  };

  // 2. Decrease quantity or remove product
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        const currentId = item.id_product || item.id_produit;

        if (currentId === productId) {
          if (item.quantity === 1) return acc;
          return [...acc, { ...item, quantity: item.quantity - 1 }];
        }

        return [...acc, item];
      }, [])
    );
  };

  // 3. Delete product completely
  const deleteItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => (item.id_product || item.id_produit) !== productId
      )
    );
  };

  // 4. Calculate total item count 
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // 5. Calculate total price (ensuring result remains a number)
  const cartTotal = cartItems.reduce((total, item) => {
    // Clean price from any extra characters just in case
    const price =
      typeof item.prix === "string"
        ? parseFloat(item.prix.replace(/[^\d.]/g, ""))
        : item.prix;

    return total + price * item.quantity;
  }, 0);

  // 6. Clear cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        deleteItem,
        cartCount,
        cartTotal,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
