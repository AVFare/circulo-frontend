import { useState } from 'react';
import { 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ProductForm from './ProductForm';

export default function AdminDrawer({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleItemClick = (section) => {
    if (section === 'products') {
      // Abre el modal de producto
      setProductModalOpen(true);
    } else if (onNavigate) {
      onNavigate(section);
    }
    setOpen(false);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
  };

  const handleProductSubmit = (productData) => {
    console.log('Producto guardado:', productData);
    // Aquí podrías enviar el producto al backend
    handleCloseProductModal();
    // Opcionalmente, mostrar una notificación de éxito
    alert('Producto creado con éxito');
  };

  return (
    <>
      <IconButton color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => handleItemClick('dashboard')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          
          <Divider />
          
          <ListItem button onClick={() => handleItemClick('products')}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Crear Producto" />
          </ListItem>
          
          <ListItem button onClick={() => handleItemClick('categories')}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categorías" />
          </ListItem>
          
          <ListItem button onClick={() => handleItemClick('users')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>
        </List>
      </Drawer>

      {/* Modal para crear producto */}
      <Dialog 
        open={productModalOpen}
        onClose={handleCloseProductModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Crear Nuevo Producto
          <IconButton
            aria-label="close"
            onClick={handleCloseProductModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ProductForm onSubmit={handleProductSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
}