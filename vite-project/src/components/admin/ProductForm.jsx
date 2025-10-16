import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

// Categorías de ejemplo (en una app real, vendrían del backend)
const categories = [
  { id: 1, name: 'Hogar' },
  { id: 2, name: 'Cocina' },
  { id: 3, name: 'Baño' },
  { id: 4, name: 'Jardín' }
];

export default function ProductForm({ product, onSubmit }) {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    price: '',
    discount: 0,
    stock: '',
    category: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando se corrige
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }
    
    if (formData.discount && (isNaN(formData.discount) || Number(formData.discount) < 0 || Number(formData.discount) > 100)) {
      newErrors.discount = 'El descuento debe ser un número entre 0 y 100';
    }
    
    if (!formData.stock) {
      newErrors.stock = 'El stock es obligatorio';
    } else if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        console.log('Producto guardado:', formData);
        // Fallback por si no se proporciona onSubmit
        alert('Producto guardado correctamente');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Descuento"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                error={!!errors.discount}
                helperText={errors.discount}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category} required>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Categoría"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
              >
                Guardar Producto
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}