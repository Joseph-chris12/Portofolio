'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext({
  items: [],
  loading: true,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('thrivea_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('thrivea_cart', JSON.stringify(items));
    }
  }, [items, loading]);

  const addToCart = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Product exists in cart, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].qty += quantity;
        toast.success(`Berhasil menambahkan ${quantity} lagi ke keranjang`);
        return newItems;
      } else {
        // Add new product
        const newItem = {
          productId: product.id,
          storeId: product.storeId || 'demo-store',
          storeName: product.storeName || 'Thrivea Mitra',
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.images?.[0] || '/images/placeholder-product.png',
          qty: quantity
        };
        toast.success(`${product.name} ditambahkan ke keranjang`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
    toast.success('Produk dihapus dari keranjang');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId ? { ...item, qty: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.qty, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      loading, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal, 
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}
