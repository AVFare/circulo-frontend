import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material';

// Placeholder QR code image URL - In a real app you'd generate this or get from backend
const SAMPLE_QR_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789";

export default function PaymentMercadoPago({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  
  const handlePaid = () => {
    setLoading(true);
    // Simulate API verification delay
    setTimeout(() => {
      setPaid(true);
      setLoading(false);
      onSubmit();
    }, 1500);
  };
  
  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Escaneá el siguiente código QR con la app de Mercado Pago
      </Typography>
      
      <Paper 
        elevation={3}
        sx={{ 
          maxWidth: 250,
          mx: 'auto',
          p: 3,
          my: 3,
          bgcolor: 'white',
          borderRadius: 2
        }}
      >
        <img 
          src={SAMPLE_QR_URL} 
          alt="Código QR de Mercado Pago" 
          style={{ width: '100%', height: 'auto' }}
        />
      </Paper>
      
      <Typography variant="body2" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        Una vez realizado el pago desde tu aplicación, hacé clic en "He pagado" para confirmar.
      </Typography>
      
      <Button 
        variant="contained"
        color="primary"
        size="large"
        onClick={handlePaid}
        disabled={loading || paid}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? 'Verificando...' : paid ? 'Pago verificado' : 'He pagado'}
      </Button>
    </Box>
  );
}