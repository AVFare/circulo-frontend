import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Alert,
  Divider,
  CircularProgress,
  CardMedia,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LabelIcon from '@mui/icons-material/Label';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';

const categories = [
  { id: 0, name: 'REMERAS' },
  { id: 1, name: 'PANTALONES' },
  { id: 2, name: 'VESTIDOS' },
  { id: 3, name: 'MEDIAS' },
  { id: 4, name: 'CALZADO' },
  { id: 5, name: 'ABRIGO' },
  { id: 6, name: 'MALLAS' },
];

const statusOptions = [
  { id: 0, name: 'PUBLISHED' },
  { id: 1, name: 'PAUSED' },
  { id: 2, name: 'SOLD' },
];

export default function ProductForm({ product, onSubmit, onClose }) {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      description: '',
      price: '',
      discount: 0,
      stock: '',
      category: 0,
      status: 0,
      imageName: '',
      imageData: '',
    }
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Por favor selecciona una imagen válida' });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'La imagen no puede superar los 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          imageName: file.name,
          imageData: reader.result, // Base64 string
        }));
        setErrors({ ...errors, image: '' });
      };
      reader.onerror = () => {
        setErrors({ ...errors, image: 'Error al cargar la imagen' });
      };
      reader.readAsDataURL(file);
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

    if (!formData.stock && formData.stock !== 0) newErrors.stock = 'El stock es obligatorio';
    else if (isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = 'El stock debe ser mayor o igual a 0';

    if (formData.category === '') newErrors.category = 'La categoría es obligatoria';

    if (!formData.imageData && !product) newErrors.image = 'La imagen es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setErrors({ submit: 'No se encontró token de autenticación. Por favor inicia sesión nuevamente.' });
        setLoading(false);
        return;
      }

      const itemDto = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        status: parseInt(formData.status),
        stock: parseInt(formData.stock),
        discount: parseInt(formData.discount) || 0,
        category: parseInt(formData.category),
        imageName: formData.imageName,
        imageData: formData.imageData ? formData.imageData.split(',')[1] : '', // Enviar solo la parte Base64, sin el prefijo
      };

      // Debug temporal
      console.log('ImageName:', itemDto.imageName);
      console.log('ImageData length:', itemDto.imageData?.length || 0);
      console.log('ImageData preview:', itemDto.imageData ? itemDto.imageData.substring(0, 50) : 'EMPTY');
      console.log('ItemDto completo (sin imageData):', {
        ...itemDto,
        imageData: itemDto.imageData ? `[${itemDto.imageData.length} chars]` : 'null'
      });

      const response = await fetch('http://localhost:4002/api/item/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemDto)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        let errorMessage = 'Error al crear producto';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.message || errorData?.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      const createdProduct = await response.json();
      setSuccessMessage('¡Producto creado exitosamente!');
      
      // Llamar al callback onSubmit si existe
      if (onSubmit) {
        onSubmit(createdProduct);
      }

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          price: '',
          discount: 0,
          stock: '',
          category: 0,
          status: 0,
          imageName: '',
          imageData: '',
        });
        setSuccessMessage('');
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('Error al crear producto:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const finalPrice =
    formData.price && formData.discount
      ? (Number(formData.price) * (1 - Number(formData.discount) / 100)).toFixed(2)
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
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBagIcon />
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
                        <LabelIcon />
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
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <InventoryIcon />
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
                        <AttachMoneyIcon />
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
                        <PercentIcon />
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

              <Grid item xs={12} md={6}>
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
                        <InventoryIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
                        <ShoppingBagIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="status"
                  label="Estado"
                  value={formData.status}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LabelIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<ImageIcon />}
                    sx={{ py: 2, borderStyle: 'dashed' }}
                  >
                    {formData.imageName || 'Seleccionar Imagen'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {errors.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.image}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {formData.imageData && (
                <Grid item xs={12}>
                  <Card sx={{ maxWidth: 300, mx: 'auto' }}>
                    <CardMedia
                      component="img"
                      image={formData.imageData}
                      alt="Preview"
                      sx={{ height: 200, objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              )}

              {successMessage && (
                <Grid item xs={12}>
                  <Alert severity="success">{successMessage}</Alert>
                </Grid>
              )}

              {errors.submit && (
                <Grid item xs={12}>
                  <Alert severity="error">{errors.submit}</Alert>
                </Grid>
              )}
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
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
