import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartAction, selectCartCount } from '../redux/cartSlice';
import { Outlet } from 'react-router-dom';
import { Fab, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from '../components/Header.jsx';
import CartDrawer from '../components/products/CartDrawer.jsx';
import AdminPanel from '../components/admin/AdminPanel.jsx';

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector((state) => state.user.profile);

  const addToCart = (product) => dispatch(addToCartAction(product));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Outlet context={{ addToCart }} />
      </Box>

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