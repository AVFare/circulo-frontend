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
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';
import CheckoutFlow from '../payments/CheckoutFlow';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, changeQty, clearCart } from '../../redux/cartSlice';

export default function CartDrawer({ open, onClose }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [stockError, setStockError] = useState(null);
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const token = useSelector((state) => state.user.token);
  
  // Función para calcular el precio final con descuento
  const getFinalPrice = (item) => {
    if (item.discount && item.discount > 0) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  };

  // total calculado desde selector en Redux

  const getImageSrc = (imageData) => {
    if (!imageData) return null;

    try {
      // Decodificar el string base64 que viene del backend
      const decodedData = atob(imageData);
      // Extraer la parte después del prefijo 'data:image/'
      const dataIndex = decodedData.indexOf('data:image/');
      if (dataIndex !== -1) {
        // Si encuentra el prefijo, retorna el string decodificado
        return decodedData;
      } else {
        // Si no encuentra el prefijo, asume que es un base64 puro y añade el prefijo
        return `data:image/png;base64,${imageData}`;
      }
    } catch (error) {
      console.error('Error procesando imagen:', error);
      return null;
    }
  };

  const handleCheckout = async () => {
    setStockError(null);
    let errorItems = [];
    for (const item of items) {
      try {
        const res = await fetch(`http://localhost:4002/api/item/catalog/products/${item.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('No se pudo obtener el producto');
        const prod = await res.json();
        if (item.qty > prod.stock) {
          errorItems.push({
            name: item.name,
            requested: item.qty,
            available: prod.stock
          });
        }
      } catch (err) {
        errorItems.push({
          name: item.name,
          requested: item.qty,
          available: 'error'
        });
      }
    }
    if (errorItems.length > 0) {
      setStockError(errorItems);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleOrderComplete = (orderData) => {
    console.log('Orden completada:', orderData);
  // Usar la acción clearCart para limpiar el carrito cuando se complete la compra
  dispatch(clearCart());
    setCheckoutOpen(false);
    onClose(); // Cerrar el drawer también
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
                    {/* Imagen del producto */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {item.imageData ? (
                        <Box
                          component="img"
                          src={getImageSrc(item.imageData)}
                          alt={item.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      
                      {/* Precio con o sin descuento */}
                      {item.discount > 0 ? (
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.disabled',
                              textDecoration: 'line-through',
                              display: 'block',
                            }}
                          >
                            ${item.price.toLocaleString('es-AR')}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ${getFinalPrice(item).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ${item.price.toLocaleString('es-AR')}
                        </Typography>
                      )}

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <TextField
                          type="number"
                          value={item.qty}
                          onChange={(e) => dispatch(changeQty({ id: item.id, qty: parseInt(e.target.value) || 0 }))}
                          size="small"
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                          sx={{ width: 70 }}
                        />
                        <IconButton size="small" onClick={() => dispatch(removeFromCart(item.id))} color="error">
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', fontWeight: 600 }}>
                    Subtotal: ${(getFinalPrice(item) * item.qty).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
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
                    ${total.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
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
                {stockError && (
                  <Box sx={{ mt: 2 }}>
                    <Typography color="error" variant="body1">
                      No hay suficiente stock para los siguientes productos:
                    </Typography>
                    <ul style={{ color: 'red', marginLeft: 16 }}>
                      {stockError.map((err, idx) => (
                        <li key={idx}>
                          {err.name}: Pediste {err.requested}, disponible {err.available}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
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