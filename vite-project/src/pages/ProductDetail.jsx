import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const URL = `http://localhost:4002/api/item/catalog/products/${id}`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(URL, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el producto: ', error);
        setError('No se pudo cargar el producto');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error">{error || 'Producto no encontrado'}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/inicio")}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    if (localStorage.getItem("userInfo")) {
      addToCart(product);
      setSnackbarOpen(true);
    } else {
      setOpenLoginDialog(true);
    }
  };

  return (
    <Box sx={{ py: 4, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <IconButton onClick={() => navigate("/inicio")} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Box
                component="img"
                src={product.img}
                alt={product.name}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  objectFit: "cover",
                  maxHeight: 500,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnOutlinedIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {product.location}
                </Typography>
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {product.name}
              </Typography>

              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: "primary.main" }}
              >
                ${product.price.toLocaleString("es-AR")}
              </Typography>

              {product.freeShipping && (
                <Chip
                  icon={<LocalShippingOutlinedIcon />}
                  label="Envío gratis a todo el país"
                  color="success"
                  sx={{ width: "fit-content" }}
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
                  fontSize: "1.1rem",
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
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", lineHeight: 1.8 }}
                >
                  Producto eco-friendly de excelente calidad. Fabricado con
                  materiales sustentables y procesos que respetan el medio
                  ambiente. Ideal para quienes buscan un estilo de vida más
                  consciente y responsable.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Características
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">✓ Material reciclable</Typography>
                  <Typography variant="body2">
                    ✓ Producción sustentable
                  </Typography>
                  <Typography variant="body2">
                    ✓ Libre de químicos tóxicos
                  </Typography>
                  <Typography variant="body2">
                    ✓ Duradero y resistente
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Snackbar de éxito */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            ¡Producto agregado al carrito!
          </Alert>
        </Snackbar>

        {/* Dialog para pedir login */}
        <Dialog 
          open={openLoginDialog} 
          onClose={() => setOpenLoginDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700, color: "primary.main" }}>
            Iniciar sesión requerido
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Para agregar productos al carrito necesitás iniciar sesión.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tenés cuenta?{" "}
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  fontWeight: 700,
                  color: "#2D5016",
                }}
              >
                Iniciá sesión aquí
              </Link>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setOpenLoginDialog(false)}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate("/")}
            >
              Ir a login
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}