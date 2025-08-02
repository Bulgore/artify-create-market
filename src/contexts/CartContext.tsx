import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  mockupUrl: string;
  designUrl: string;
  printArea: any;
  quantity: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity' | 'total'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        const newItem: CartItem = {
          ...action.payload,
          quantity: 1,
          total: action.payload.price,
        };
        newItems = [...state.items, newItem];
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + item.total, 0),
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + item.total, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity, total: action.payload.quantity * item.price }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + item.total, 0),
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'LOAD_CART': {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.total, 0),
      };
    }
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity' | 'total'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity' | 'total'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};