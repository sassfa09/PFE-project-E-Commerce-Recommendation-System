import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // تحميل السلة من localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // حفظ السلة في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. إضافة منتج للسلة
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // نضمنوا أن id_product كاين (سواء سميتيه id_produit أو id_product)
      const productId = product.id_product || product.id_produit;
      
      const isItemInCart = prevItems.find((item) => (item.id_product || item.id_produit) === productId);

      if (isItemInCart) {
        return prevItems.map((item) =>
          (item.id_product || item.id_produit) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // تأكدي أن السعر كيتحول لرقم فاش كيدخل للسلة أول مرة
      const cleanPrice = typeof product.prix === "string" 
        ? parseFloat(product.prix.replace(/[^\d.]/g, "")) 
        : product.prix;

      return [...prevItems, { ...product, id_product: productId, prix: cleanPrice, quantity: 1 }];
    });
  };

  // 2. نقص الكمية أو حذف المنتج
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

  // 3. حذف المنتج بمرة واحدة
  const deleteItem = (productId) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => (item.id_product || item.id_produit) !== productId)
    );
  };

  // 4. حساب عدد المنتجات (Badge)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 5. حساب الثمن الإجمالي (مع التأكد من أن الحساب كيبقى رقم)
  const cartTotal = cartItems.reduce((total, item) => {
    // تنظيف السعر من أي حروف زائدة تحسباً لأي غلط
    const price = typeof item.prix === "string" 
      ? parseFloat(item.prix.replace(/[^\d.]/g, "")) 
      : item.prix;
    
    return total + (price * item.quantity);
  }, 0);

  // 6. مسح السلة
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      deleteItem, 
      cartCount, 
      cartTotal, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);