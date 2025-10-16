import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function PaymentSummary({ cart, paymentStatus, onComplete }) {
  // Cambiar item.quantity por item.qty para coincidir con la estructura del carrito
  const subtotal = cart.reduce((total, item) => total + item.price * (item.qty || 1), 0);
  const shipping = subtotal > 10000 ? 0 : 1000; // Envío gratis para compras mayores a 10k
  const total = subtotal + shipping;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Resumen de compra
      </Typography>
      
      <List disablePadding>
        {cart.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
            <ListItemText 
              primary={item.name} 
              secondary={`Cantidad: ${item.qty || 1}`} 
            />
            <Typography variant="body2">
              {formatPrice(item.price * (item.qty || 1))}
            </Typography>
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="body1">
            {formatPrice(subtotal)}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Envío" />
          <Typography variant="body1">
            {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={<Typography variant="h6">Total</Typography>} />
          <Typography variant="h6">
            {formatPrice(total)}
          </Typography>
        </ListItem>
      </List>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Chip 
          icon={paymentStatus === 'approved' ? <CheckCircleOutlineIcon /> : <HourglassEmptyIcon />}
          label={paymentStatus === 'approved' ? 'Pago aprobado' : 'Pendiente de pago'}
          color={paymentStatus === 'approved' ? 'success' : 'default'}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        {onComplete && (
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={onComplete}
          >
            Finalizar
          </Button>
        )}
      </Box>
    </Box>
  );
}