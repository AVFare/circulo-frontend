import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [], // cada item: { id, name, price, discount, qty, imageData, stock, ... }
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		// Agrega un producto al carrito. Si ya existe, aumenta la cantidad
		addToCart: (state, action) => {
			const incoming = action.payload;
			const idx = state.items.findIndex(i => i.id === incoming.id);
			if (idx !== -1) {
				// Si viene qty explícita, la sumamos. En caso contrario sumamos 1
				const addQty = typeof incoming.qty === 'number' ? incoming.qty : 1;
				state.items[idx].qty = (state.items[idx].qty || 0) + addQty;
			} else {
				state.items.unshift({ ...incoming, qty: typeof incoming.qty === 'number' ? incoming.qty : 1 });
			}
		},

		// Remover por id
		removeFromCart: (state, action) => {
			const id = action.payload;
			state.items = state.items.filter(i => i.id !== id);
		},

		// Cambiar cantidad con replace. Si qty <= 0 se elimina.
		changeQty: (state, action) => {
			const { id, qty } = action.payload;
			const idx = state.items.findIndex(i => i.id === id);
			if (idx === -1) return;
			const newQty = Number(qty) || 0;
			if (newQty <= 0) {
				state.items.splice(idx, 1);
			} else {
				state.items[idx].qty = newQty;
			}
		},

		// Vaciar carrito
		clearCart: (state) => {
			state.items = [];
		},

		// Reemplazar todo el carrito puede ser útil para pruebas del admin
		setCartItems: (state, action) => {
			state.items = Array.isArray(action.payload) ? action.payload : [];
		},
	},
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((s, it) => s + (it.qty || 0), 0);
export const selectCartTotal = (state) => state.cart.items.reduce((s, it) => {
	const price = it.price || 0;
	const discount = it.discount && it.discount > 0 ? (1 - it.discount / 100) : 1;
	const final = price * discount;
	return s + final * (it.qty || 0);
}, 0);

export const { addToCart, removeFromCart, changeQty, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;

