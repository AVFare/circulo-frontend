import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  ShoppingBag,
  Tag,
  Package,
  DollarSign,
  Percent,
  Save,
} from 'lucide-react';

const categories = [
  { id: 1, name: 'Remeras' },
  { id: 2, name: 'Pantalones' },
  { id: 3, name: 'Vestidos' },
  { id: 4, name: 'Calzado' },
  { id: 5, name: 'Abrigos' },
];

export default function ProductForm({ product, onSubmit }) {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      description: '',
      price: '',
      discount: 0,
      stock: '',
      category: '',
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.description.trim())
      newErrors.description = 'La descripción es obligatoria';
    if (!formData.price) newErrors.price = 'El precio es obligatorio';
    else if (isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = 'El precio debe ser un número mayor a 0';

    if (
      formData.discount &&
      (isNaN(formData.discount) ||
        Number(formData.discount) < 0 ||
        Number(formData.discount) > 100)
    )
      newErrors.discount = 'El descuento debe ser entre 0 y 100';

    if (!formData.stock) newErrors.stock = 'El stock es obligatorio';
    else if (isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = 'El stock debe ser mayor o igual a 0';

    if (!formData.category) newErrors.category = 'La categoría es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (onSubmit) onSubmit(formData);
      else {
        console.log('Producto guardado:', formData);
        alert('Producto guardado correctamente');
      }
    }
  };

  const finalPrice =
    formData.price && formData.discount
      ? (Number(formData.price) * (1 - Number(formData.discount) / 100)).toFixed(
          2
        )
      : formData.price;

  return (
    <Box sx={{ bgcolor: 'background.default', p: 4 }}>
      <Box mx="auto">
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              width: 48,
              //height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={22} />
          </Box>
          <Box>
            <Typography variant="h4" color="text.primary" fontWeight={700}>
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completa los datos del producto para tu tienda
            </Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Nombre del Producto"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tag size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Descripción"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Package size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="price"
                  label="Precio"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DollarSign size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="discount"
                  label="Descuento (%)"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange}
                  error={!!errors.discount}
                  helperText={errors.discount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Percent size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {formData.price && formData.discount > 0 && (
                <Grid item xs={12}>
                  <Alert
                    icon={false}
                    severity="success"
                    sx={{
                      border: '1px solid',
                      borderColor: 'success.light',
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight={600} color="success.dark">
                        Precio Final
                      </Typography>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'success.light',
                            mr: 1,
                          }}
                        >
                          ${formData.price}
                        </Typography>
                        <Typography
                          variant="h6"
                          component="span"
                          fontWeight={700}
                          color="success.dark"
                        >
                          ${finalPrice}
                        </Typography>
                      </Box>
                    </Box>
                  </Alert>
                </Grid>
              )}

              <Grid>
                <TextField
                  fullWidth
                  name="stock"
                  label="Stock Disponible"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Package size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid  item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="category"
                  label="Categoría"
                  value={formData.category}
                  onChange={handleChange}
                  error={!!errors.category}
                  helperText={errors.category}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ShoppingBag size={18} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Selecciona una categoría</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <Box p={3} bgcolor="background.default">
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSubmit}
              startIcon={<Save size={18} />}
            >
              Guardar Producto
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
