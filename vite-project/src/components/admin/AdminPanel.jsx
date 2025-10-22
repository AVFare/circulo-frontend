import { useState, useEffect } from 'react';
import { Box, Typography, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, IconButton, Divider, AppBar, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CloseIcon from '@mui/icons-material/Close';
import ProductForm from './ProductForm';
import OrderList from './OrderList';

const drawerWidth = 280;

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar datos de usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Si el usuario no es admin, no mostrar nada
  if (!user || user.role === 'user') {
    return null;
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 960) {
      setOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'primary.main',
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Panel de Administración
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          display: { xs: 'block', sm: 'block' }
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          px: 1
        }}>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem 
            button 
            selected={activeSection === 'dashboard'} 
            onClick={() => handleSectionChange('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'products'} 
            onClick={() => handleSectionChange('products')}
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'categories'} 
            onClick={() => handleSectionChange('categories')}
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categorías" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'orders'} 
            onClick={() => handleSectionChange('orders')}
          >
            <ListItemIcon>
              <ShoppingBagIcon />
            </ListItemIcon>
            <ListItemText primary="Órdenes" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'users'} 
            onClick={() => handleSectionChange('users')}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {activeSection === 'dashboard' && (
          <Typography variant="h4">Dashboard</Typography>
        )}
        
        {activeSection === 'products' && (
          <ProductForm />
        )}
        
        {activeSection === 'categories' && (
          <Typography variant="h4">Gestión de Categorías</Typography>
        )}
        
        {activeSection === 'orders' && (
          <OrderList />
        )}
        
        {activeSection === 'users' && (
          <Typography variant="h4">Gestión de Usuarios</Typography>
        )}
      </Box>
    </Box>
  );
}