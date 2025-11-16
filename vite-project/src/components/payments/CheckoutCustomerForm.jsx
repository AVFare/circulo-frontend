import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, Grid, FormHelperText } from '@mui/material';

export default function CheckoutCustomerForm({ initialData = {}, onSubmit }) {
  // Profile from redux (may be null if not loaded)
  const profile = useSelector((state) => state.users?.profile || {});

  // Build initial form data (only editable fields live here)
  const initialForm = {
    phone: initialData.phone || '',
    address: initialData.address || '',
    address2: initialData.address2 || '',
    city: initialData.city || '',
    zipCode: initialData.zipCode || '',
  };

  // Pure helper to compute validation errors (no side effects)
  const computeErrors = (data) => {
    const newErrors = {};
    ['phone', 'address', 'city', 'zipCode'].forEach((field) => {
      if (!data[field]?.toString().trim()) {
        newErrors[field] = 'Campo obligatorio';
      }
    });
    if (data.phone && !/^\d+$/.test(data.phone)) {
      newErrors.phone = 'Solo números';
    }
    if (data.zipCode && !/^\d+$/.test(data.zipCode)) {
      newErrors.zipCode = 'Solo números';
    }
    return newErrors;
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState(() => computeErrors(initialForm));
  const [isFormValid, setIsFormValid] = useState(() => Object.keys(computeErrors(initialForm)).length === 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    const newErrors = computeErrors(next);
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = computeErrors(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      // Pull name/email from profile (not from the editable form)
      firstName: profile?.firstName || profile?.firstname || '',
      lastName: profile?.lastName || profile?.lastname || '',
      email: profile?.email || '',
      ...formData,
    };

    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 0 }}>
      <Typography variant="h6" gutterBottom>
        Información de contacto
      </Typography>

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nombre"
            value={profile?.firstName || profile?.firstname || ''}
            fullWidth
            disabled
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Apellido"
            value={profile?.lastName || profile?.lastname || ''}
            fullWidth
            disabled
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Email"
            value={profile?.email || ''}
            fullWidth
            disabled
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Dirección 2 (Opcional)"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            placeholder="Ej: Lote 22, Apartamento 8C, Torre B, etc."
            helperText="Información adicional para el envío"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Código postal"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
          />
        </Grid>
      </Grid>

      {!isFormValid && (
        <FormHelperText error sx={{ mt: 2 }}>
          Por favor, complete todos los campos correctamente.
        </FormHelperText>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button type="submit" variant="contained" size="large" disabled={!isFormValid}>
          Continuar
        </Button>
      </Box>
    </Box>
  );
}
