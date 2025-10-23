import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea, 
  Button,
  styled
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentCardForm from './PaymentCardForm';
import PaymentMercadoPago from './PaymentMercadoPago';

const MethodCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  transition: theme.transitions.create(['border', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
  transform: selected ? 'scale(1.02)' : 'scale(1)',
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
}));

export default function PaymentMethodSelector({ onSubmit }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setPaymentData(null);
  };
  
  const handleCardFormSubmit = (cardData) => {
    setPaymentData({ method: 'card', cardData });
  };
  
  const handleMercadoPagoSubmit = () => {
    setPaymentData({ method: 'mercadopago' });
  };
  
  const handleConfirm = () => {
    onSubmit(paymentData);
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Método de pago
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <MethodCard selected={selectedMethod === 'card'}>
            <CardActionArea 
              onClick={() => handleSelectMethod('card')} 
              sx={{ height: '100%' }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CreditCardIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="div">
                  Tarjeta de crédito
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visa, Mastercard, American Express
                </Typography>
              </CardContent>
            </CardActionArea>
          </MethodCard>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <MethodCard selected={selectedMethod === 'mercadopago'}>
            <CardActionArea 
              onClick={() => handleSelectMethod('mercadopago')} 
              sx={{ height: '100%' }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <PaymentIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="div">
                  Mercado Pago
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pago con QR desde tu app
                </Typography>
              </CardContent>
            </CardActionArea>
          </MethodCard>
        </Grid>
      </Grid>
      
      {selectedMethod === 'card' && (
        <PaymentCardForm onSubmit={handleCardFormSubmit} />
      )}
      
      {selectedMethod === 'mercadopago' && (
        <PaymentMercadoPago onSubmit={handleMercadoPagoSubmit} />
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          size="large" 
          disabled={!paymentData} 
          onClick={handleConfirm}
        >
          Confirmar pago
        </Button>
      </Box>
    </Box>
  );
}