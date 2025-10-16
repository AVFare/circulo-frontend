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
    onOrderComplete({
      customer: customerData,
      payment: paymentData,
      cart
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      scroll="paper"
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
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
        <CheckoutStepper activeStep={activeStep} steps={STEPS} />
      </Box>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
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
          <Grid item xs={12} md={4}>
            <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }} />
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