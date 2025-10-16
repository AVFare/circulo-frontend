import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Fab, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from '../components/Header.jsx';
import CartDrawer from '../components/products/CartDrawer.jsx';
import AdminPanel from '../components/admin/AdminPanel.jsx'; // Importa el AdminPanel

export default function MainLayout() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar datos de usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Muestra el AdminPanel solo si el usuario no es "user" */}
      {user && user.role !== 'user' && <AdminPanel />}
      
      <Header />
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Outlet context={{ addToCart }} />
      </Box>

      <Fab
        color="primary"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          boxShadow: '0 4px 20px rgba(45, 80, 22, 0.3)',
        }}
        aria-label="carrito de compras"
      >
        <Badge badgeContent={cartCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onChangeQty={changeQty}
        clearCart={clearCart}
      />
    </Box>
  );
}