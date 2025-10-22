import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Mis Órdenes - CÍRCULO';
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No se encontró token de autenticación');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(''); // Limpiar errores previos
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const url = `http://localhost:4002/api/action/orders?page=${page}&size=${rowsPerPage}`;

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Error response:', text);
            throw new Error(`Error ${response.status}: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las órdenes:', error);
        setError('No se pudieron cargar las órdenes');
        setLoading(false);
      });
  }, [page, rowsPerPage]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'DELIVERED':
        return 'Entregada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <ShoppingBagIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4">Mis Órdenes</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No tienes órdenes aún
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('es-AR') : 'N/A'}
                  </TableCell>
                  <TableCell>${order.importeTotal?.toLocaleString('es-AR') || '0'}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentMethod || 'N/A'}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalles">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(order)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Primera página">
              <span>
                <IconButton 
                  onClick={() => setPage(0)} 
                  disabled={page === 0}
                  size="small"
                >
                  <FirstPageIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Última página">
              <span>
                <IconButton 
                  onClick={() => setPage(totalPages - 1)} 
                  disabled={page >= totalPages - 1}
                  size="small"
                >
                  <LastPageIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Typography variant="body2">
            Página {page + 1} de {totalPages} - Total: {totalElements} órdenes
          </Typography>
        </Box>
      </TableContainer>

      {/* Modal de detalles de la orden */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseModal}
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
          Detalles de la Orden #{selectedOrder?.id}
          <IconButton
            onClick={handleCloseModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('es-AR') : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Método de Pago
                </Typography>
                <Chip
                  label={selectedOrder.paymentMethod || 'N/A'}
                  color="primary"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h5" color="primary.main">
                  ${selectedOrder.importeTotal?.toLocaleString('es-AR') || '0'}
                </Typography>
              </Grid>

              {/* Información de envío */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Información de Envío
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dirección
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.address || 'N/A'}
                    </Typography>
                    {selectedOrder.addressLine2 && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.addressLine2}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ciudad
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.city || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Código Postal
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.postalCode || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.phone || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Productos
                </Typography>
                <List>
                  {selectedOrder.items?.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.item?.name || `Producto ID: ${item.item?.id}`}
                        secondary={`Cantidad: ${item.cantidad || 1}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
