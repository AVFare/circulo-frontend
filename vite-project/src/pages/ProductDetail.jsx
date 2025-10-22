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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ProductForm from "../components/admin/ProductForm";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Verificar si el usuario es admin
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setIsAdmin(user.role === 'ADMIN');
    }
  }, []);

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
        // Actualizar título con el nombre del producto
        document.title = `${data.name} - CÍRCULO`;
      })
      .catch((error) => {
        console.error('Error al obtener el producto: ', error);
        setError('No se pudo cargar el producto');
        setLoading(false);
      });
  }, [id, refreshTrigger]);

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

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleProductSubmit = (productData) => {
    console.log('Producto actualizado:', productData);
    setRefreshTrigger(prev => prev + 1);
    handleCloseEditModal();
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Se marcará como DELETED.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      // Soft delete: cambiar estado a DELETED
      const response = await fetch(`http://localhost:4002/api/item/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 2 }) // 2 = DELETED
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      alert('Producto eliminado exitosamente');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto: ' + error.message);
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
              {product.imageData ? (
                <Box
                  component="img"
                  src={`data:image/png;base64,${product.imageData}`}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    objectFit: "cover",
                    maxHeight: 500,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 500,
                    borderRadius: 2,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Sin imagen
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {product.name}
              </Typography>

              {/* Información de admin */}
              {isAdmin && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Panel de Administrador
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Estado:
                      </Typography>
                      <Chip
                        label={product.status || 'PUBLISHED'}
                        size="small"
                        color={
                          product.status === 'PUBLISHED' ? 'success' :
                          product.status === 'SOLD' ? 'info' :
                          product.status === 'DELETED' ? 'error' :
                          'default'
                        }
                      />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Stock:
                      </Typography>
                      <Typography variant="body2">
                        {product.stock || 0} unidades
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        size="small"
                        onClick={handleEdit}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={handleDelete}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}

              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: "primary.main" }}
              >
                ${product.price.toLocaleString("es-AR")}
              </Typography>

              <Divider />

              {/* Mostrar botón solo si NO es admin */}
              {!isAdmin && (
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
              )}

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Descripción
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", lineHeight: 1.8 }}
                >
                  {product.description || "Sin descripción disponible"}
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

        {/* Modal para editar producto */}
        <Dialog 
          open={editModalOpen}
          onClose={handleCloseEditModal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Editar Producto
            <IconButton
              aria-label="close"
              onClick={handleCloseEditModal}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <ProductForm 
              product={product} 
              onSubmit={handleProductSubmit}
              onClose={handleCloseEditModal}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}