// src/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) existing.quantity++;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;

// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({ reducer: { cart: cartReducer } });

// src/App.js
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './app/store';
import { addItem, removeItem, updateQuantity } from './features/cart/cartSlice';

const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Phone', price: 800 }
];

function ProductList() {
  const dispatch = useDispatch();
  return products.map(p => (
    <div key={p.id}>
      {p.name} - ${p.price}
      <button onClick={() => dispatch(addItem(p))}>Add to Cart</button>
    </div>
  ));
}

function Cart() {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  return (
    <>
      <h2>Cart</h2>
      {items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
          <input type="number" min="1" value={item.quantity}
            onChange={e => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))} />
        </div>
      ))}
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <h1>Shopping Cart</h1>
      <ProductList />
      <Cart />
    </Provider>
  );
}
