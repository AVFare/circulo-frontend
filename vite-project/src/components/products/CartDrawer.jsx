import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Divider,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useState } from 'react';
import CheckoutFlow from '../payments/CheckoutFlow';

export default function CartDrawer({ open, onClose, items, onRemove, onChangeQty }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleOrderComplete = (orderData) => {
    console.log('Orden completada:', orderData);
    // Aquí podrías enviar la orden a un backend o guardarla
    // Limpiar el carrito después de la compra
    // clearCart();
    setCheckoutOpen(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, height: '100%', display: 'flex', flexDirection: 'column' }}>
       
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Tu carrito
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Lista de productos SUPER MAPEADA */}
        {items.length === 0 ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Tu carrito está vacío
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    p: 2,
                    mb: 2,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    {/* Imagen :D  */}
                    <Box
                      component="img"
                      src={item.img}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${item.price.toLocaleString('es-AR')}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <TextField
                          type="number"
                          value={item.qty}
                          onChange={(e) => onChangeQty(item.id, parseInt(e.target.value))}
                          size="small"
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                          sx={{ width: 70 }}
                        />
                        <IconButton size="small" onClick={() => onRemove(item.id)} color="error">
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', fontWeight: 600 }}>
                    Subtotal: ${(item.price * item.qty).toLocaleString('es-AR')}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ${total.toLocaleString('es-AR')}
                  </Typography>
                </Stack>

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  disabled={items.length === 0}
                  onClick={handleCheckout}
                >
                  Pagar ahora
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>

      <CheckoutFlow 
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={items}
        onOrderComplete={handleOrderComplete}
      />
    </Drawer>
  );
}