import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Swal from 'sweetalert2';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

// Save cart data to local storage
const saveCartToLocalStorage = (cartItems: CartItem[]) => {


  const userToken = localStorage.getItem('userToken');

  if (userToken) {
    // Token exists, use it
    console.log('User Token:', userToken);
    const key = `${userToken}_cart`; // Construct the key with userToken
    localStorage.setItem(key, JSON.stringify(cartItems));
  } else {
    if (cartItems.length === 1) {
      Swal.fire({
        title: 'Save Cart Data?',
        text: 'You are not logged in. Do you want to save the cart data please login?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, login',
        cancelButtonText: 'No, cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login or handle the case accordingly
          window.location.href = '/login';
        }
      });
    }
    const key = `_cart`; // Construct the key with userToken
    sessionStorage.setItem(key, JSON.stringify(cartItems));
  }

};

// Load cart data from local storage
const loadCartFromLocalStorage = (): CartItem[] => {
  const userToken = localStorage.getItem('userToken');

  if (userToken) {
    // Token exists, use it
    console.log('User Token:', userToken);
    const key = `${userToken}_cart`; // Construct the key with userToken
    const cartData = localStorage.getItem(key);
    return cartData ? JSON.parse(cartData) : [];
  } else {
    const key = `_cart`; // Construct the key with userToken
    const cartData = sessionStorage.getItem(key);
    return cartData ? JSON.parse(cartData) : [];
  }


};



export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromLocalStorage());

  useEffect(() => {
    loadCartFromLocalStorage();


  }, []);

  const addToCart = async (item: CartItem) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.find((i) => i.id === item.id)
        ? prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        : [...prevItems, { ...item, quantity: 1 }];
      saveCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = async (itemId: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      saveCartToLocalStorage(updatedItems);

      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
