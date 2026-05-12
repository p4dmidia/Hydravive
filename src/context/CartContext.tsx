import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  points_cost: number;
  usePoints: boolean;
  image: string;
  quantity: number;
  category: string;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: number, usePoints: boolean) => void;
  updateQuantity: (id: number, usePoints: boolean, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPoints: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('hydravive_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('hydravive_cart', JSON.stringify(cart));
  }, [cart]);

  const { profile } = useAuth();

  const addToCart = (product: any, quantity: number = 1) => {
    const { usePoints, affiliate_price, price, points_cost } = product;
    
    // Se o usuário estiver logado e for um afiliado, usa o preço de afiliado (se existir)
    const isAffiliate = profile && profile.role === 'affiliate';
    const finalPrice = isAffiliate && affiliate_price > 0 ? affiliate_price : price;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.usePoints === !!usePoints);
      if (existingItem) {
        return prevCart.map(item =>
          (item.id === product.id && item.usePoints === !!usePoints) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { 
        ...product, 
        price: usePoints ? 0 : finalPrice,
        points_cost: usePoints ? (points_cost || 0) : (product.points || 0),
        usePoints: !!usePoints,
        quantity: quantity 
      }];
    });
  };

  const removeFromCart = (id: number, usePoints: boolean) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.usePoints === usePoints)));
  };

  const updateQuantity = (id: number, usePoints: boolean, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, usePoints);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => (item.id === id && item.usePoints === usePoints ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.usePoints ? 0 : item.price * item.quantity), 0);
  const totalPoints = cart.reduce((sum, item) => sum + (item.usePoints ? item.points_cost * item.quantity : 0), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalPrice,
      totalPoints 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
