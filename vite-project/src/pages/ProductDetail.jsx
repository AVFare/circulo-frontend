// src/pages/ProductDetail.jsx
import { useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { products } from '../mock/products.js';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const product = products.find((x) => String(x.id) === id);

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6">Producto no encontrado.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/inicio')} sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <IconButton onClick={() => navigate('/inicio')} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Grid container spacing={4}>
 
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <Box
                component="img"
                src={product.img}
                alt={product.name}
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  objectFit: 'cover',
                  maxHeight: 500,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.location}
                </Typography>
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {product.name}
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                ${product.price.toLocaleString('es-AR')}
              </Typography>

              {product.freeShipping && (
                <Chip
                  icon={<LocalShippingOutlinedIcon />}
                  label="Envío gratis a todo el país"
                  color="success"
                  sx={{ width: 'fit-content' }}
                />
              )}

              <Divider />

              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                Agregar al carrito
              </Button>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Descripción
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  Producto eco-friendly de excelente calidad. Fabricado con materiales sustentables
                  y procesos que respetan el medio ambiente. Ideal para quienes buscan un estilo de
                  vida más consciente y responsable. 
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Características
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">✓ Material reciclable</Typography>
                  <Typography variant="body2">✓ Producción sustentable</Typography>
                  <Typography variant="body2">✓ Libre de químicos tóxicos</Typography>
                  <Typography variant="body2">✓ Duradero y resistente</Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            ¡Producto agregado al carrito!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}