import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box, 
  Grid, 
  Divider, 
  Typography 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckoutStepper from './CheckoutStepper';
import CheckoutCustomerForm from './CheckoutCustomerForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentSummary from './PaymentSummary';

const STEPS = ['Datos personales', 'Método de pago', 'Confirmación'];

export default function CheckoutFlow({ open, onClose, cart, onOrderComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [paymentData, setPaymentData] = useState({
    method: '',
    cardData: null,
    status: 'pending', // pending, approved, rejected
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => Math.max(0, prev - 1));
  
  const handleCustomerDataSubmit = (data) => {
    setCustomerData(data);
    handleNext();
  };

  const handlePaymentSubmit = (data) => {
    setPaymentData({
      ...paymentData,
      ...data,
      status: 'approved'
    });
    handleNext();
  };

  const handleComplete = () => {
    // Obtener token y usuario del localStorage
    const token = localStorage.getItem('access_token');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!token || !userInfo.id) {
      console.error('No se encontró token o ID de usuario');
      alert('Error: No hay sesión activa. Por favor inicia sesión.');
      return;
    }

    // Mapear el método de pago al formato del backend
    const paymentMethodMap = {
      'card': 'CARD',
      'mercadopago': 'MERCADOPAGO'
    };

    // Construir el objeto de orden según la documentación del backend
    const datosAEnviar = {
      user: { id: userInfo.id },
      items: cart.map(item => ({
        item: { id: item.id },
        cantidad: item.qty || 1
      })),
      phone: customerData.phone,
      address: customerData.address,
      addressLine2: customerData.address2 && customerData.address2.trim() !== '' ? customerData.address2 : null,
      city: customerData.city,
      postalCode: customerData.zipCode,
      paymentMethod: paymentMethodMap[paymentData.method] || 'MERCADOPAGO'
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosAEnviar),
    };

    const URL = "http://localhost:4002/api/action/orders";

    fetch(URL, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear la orden');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Orden creada exitosamente:', data);
        // Llamar al callback con los datos completos
        onOrderComplete({
          customer: customerData,
          payment: paymentData,
          cart,
          orderData: data
        });
        onClose();
      })
      .catch((error) => {
        console.error("Error al crear la orden: ", error);
        alert('Error al procesar la orden. Por favor intenta nuevamente.');
      });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        Finalizar compra
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <CheckoutStepper activeStep={activeStep} steps={STEPS} />
      </Box>
      
      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          <Grid item xs={12} md={8} sx={{ p: 2, maxHeight: '60vh', overflow: 'auto' }}>
            {activeStep === 0 && (
              <CheckoutCustomerForm 
                initialData={customerData} 
                onSubmit={handleCustomerDataSubmit} 
              />
            )}
            {activeStep === 1 && (
              <PaymentMethodSelector 
                onSubmit={handlePaymentSubmit} 
              />
            )}
            {activeStep === 2 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  ¡Compra realizada con éxito!
                </Typography>
                <Typography variant="body1" paragraph>
                  Tu pedido ha sido procesado correctamente.
                </Typography>
                <Typography variant="body1" paragraph>
                  Hemos enviado un correo a {customerData.email} con los detalles de tu compra.
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4} sx={{ 
            bgcolor: 'background.paper',
            borderLeft: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.12)' },
            borderTop: { xs: '1px solid rgba(0, 0, 0, 0.12)', md: 'none' }
          }}>
            <PaymentSummary 
              cart={cart} 
              paymentStatus={paymentData.status}
              onComplete={activeStep === 2 ? handleComplete : null}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}