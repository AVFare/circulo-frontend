import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartAction, selectCartCount } from '../redux/cartSlice';
import { Outlet } from 'react-router-dom';
import { Fab, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from '../components/Header.jsx';
import CartDrawer from '../components/products/CartDrawer.jsx';
import AdminPanel from '../components/admin/AdminPanel.jsx'; // Importa el AdminPanel

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    // Recuperar datos de usuario del localStorage
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const addToCart = (product) => dispatch(addToCartAction(product));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Muestra el AdminPanel solo si el usuario no es "user" */}
      {user && user.role !== 'user' && <AdminPanel />}
      
      <Header />
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Outlet context={{ addToCart }} />
      </Box>

      {/* Mostrar botón del carrito solo si NO es admin */}
      {(!user || user.role !== 'ADMIN') && (
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
      )}

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
}