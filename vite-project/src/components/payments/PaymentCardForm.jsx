import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Grid, 
  FormHelperText,
  Typography 
} from '@mui/material';

export default function PaymentCardForm({ onSubmit }) {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    validateForm();
    if (isFormValid) {
      onSubmit(cardData);
    }
  }, [cardData, isFormValid]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    
    // Format expiry date MM/YY
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }
    
    // Limit CVV to 3 or 4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number (16 digits)
    const cardNumberDigits = cardData.number.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.number = 'Campo obligatorio';
    } else if (!/^\d{16}$/.test(cardNumberDigits)) {
      newErrors.number = 'Número de tarjeta inválido (16 dígitos)';
    }
    
    // Validate card holder name
    if (!cardData.name) {
      newErrors.name = 'Campo obligatorio';
    }
    
    // Validate expiry date (MM/YY format and not expired)
    if (!cardData.expiry) {
      newErrors.expiry = 'Campo obligatorio';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = 'Formato inválido (MM/YY)';
    } else {
      const [month, year] = cardData.expiry.split('/');
      const expYear = parseInt('20' + year, 10);
      const expMonth = parseInt(month, 10) - 1; // JS months are 0-indexed
      const expDate = new Date(expYear, expMonth, 1);
      const today = new Date();
      
      if (expMonth < 0 || expMonth > 11) {
        newErrors.expiry = 'Mes inválido (01-12)';
      } else if (expDate < today) {
        newErrors.expiry = 'Tarjeta vencida';
      }
    }
    
    // Validate CVV (3-4 digits)
    if (!cardData.cvv) {
      newErrors.cvv = 'Campo obligatorio';
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'CVV inválido (3-4 dígitos)';
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Ingresa los datos de tu tarjeta
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Número de tarjeta"
            name="number"
            value={cardData.number}
            onChange={handleChange}
            error={!!errors.number}
            helperText={errors.number}
            placeholder="1234 5678 9012 3456"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre en la tarjeta"
            name="name"
            value={cardData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="NOMBRE APELLIDO"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Vencimiento (MM/YY)"
            name="expiry"
            value={cardData.expiry}
            onChange={handleChange}
            error={!!errors.expiry}
            helperText={errors.expiry}
            placeholder="MM/YY"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={cardData.cvv}
            onChange={handleChange}
            error={!!errors.cvv}
            helperText={errors.cvv}
            placeholder="123"
          />
        </Grid>
      </Grid>
      
      {Object.keys(errors).length > 0 && (
        <FormHelperText error sx={{ mt: 2 }}>
          Por favor, complete correctamente los datos de la tarjeta.
        </FormHelperText>
      )}
    </Box>
  );
}