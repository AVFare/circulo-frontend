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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import UserList from './UserList';
import OrderList from './OrderList';

export default function AdminDrawer({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productListModalOpen, setProductListModalOpen] = useState(false);
  const [userListModalOpen, setUserListModalOpen] = useState(false);
  const [orderListModalOpen, setOrderListModalOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleItemClick = (section) => {
    if (section === 'products') {
      setProductModalOpen(true);
    } else if (section === 'productList') {
      setProductListModalOpen(true);
    } else if (section === 'users') {
      setUserListModalOpen(true);
    } else if (section === 'orders') {
      setOrderListModalOpen(true);
    } else if (onNavigate) {
      onNavigate(section);
    }
    setOpen(false);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
  };

  const handleCloseProductListModal = () => {
    setProductListModalOpen(false);
  };

  const handleCloseUserListModal = () => {
    setUserListModalOpen(false);
  };

  const handleCloseOrderListModal = () => {
    setOrderListModalOpen(false);
  };

  const handleProductSubmit = (productData) => {
    console.log('Producto guardado:', productData);
    handleCloseProductModal();
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
          <ListItem button onClick={() => handleItemClick('products')}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Crear Producto" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('productList')}>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Ver Productos" />
          </ListItem>
          
          <Divider />
          
          <ListItem button onClick={() => handleItemClick('users')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('orders')}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Órdenes" />
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

      {/* Modal para ver lista de productos */}
      <Dialog 
        open={productListModalOpen}
        onClose={handleCloseProductListModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Gestión de Productos
          <IconButton
            aria-label="close"
            onClick={handleCloseProductListModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ProductList />
        </DialogContent>
      </Dialog>

      {/* Modal para ver lista de usuarios */}
      <Dialog 
        open={userListModalOpen}
        onClose={handleCloseUserListModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Gestión de Usuarios
          <IconButton
            aria-label="close"
            onClick={handleCloseUserListModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <UserList />
        </DialogContent>
      </Dialog>

      {/* Modal para ver lista de órdenes */}
      <Dialog 
        open={orderListModalOpen}
        onClose={handleCloseOrderListModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Gestión de Órdenes
          <IconButton
            aria-label="close"
            onClick={handleCloseOrderListModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <OrderList />
        </DialogContent>
      </Dialog>
    </>
  );
}