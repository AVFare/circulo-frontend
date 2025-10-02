// src/layouts/MainLayout.jsx
import { useState } from "react";
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";
import { Fab, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawer from "../components/CartDrawer.jsx";

export default function MainLayout() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const changeQty = (id, qty) =>
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      )
    );

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <>
      <Header />

      {/* Outlet recibe props extra para que las páginas puedan usar addToCart */}
      <Outlet context={{ addToCart }} />

      {/* Botón flotante carrito */}
      <Fab
        color="success"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        aria-label="carrito"
      >
        <Badge badgeContent={cartCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      {/* Drawer del carrito */}
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onChangeQty={changeQty}
      />
    </>
  );
}
