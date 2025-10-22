import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

export default function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const fetchOrders = () => {
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
            console.error('Admin error response:', text);
            throw new Error(`Error ${response.status}: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setOrderList(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener órdenes:', error);
        setError('No se pudieron cargar las órdenes');
        setLoading(false);
      });
  };

  const fetchUserDetails = (userId) => {
    const token = localStorage.getItem('access_token');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    setLoadingUser(true);
    fetch(`http://localhost:4002/api/user/users/${userId}`, options)
      .then((response) => response.json())
      .then((user) => {
        setSelectedUser(user);
        setLoadingUser(false);
      })
      .catch((error) => {
        console.error('Error al obtener usuario:', error);
        setSelectedUser(null);
        setLoadingUser(false);
      });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
    // Intentar obtener el userId de diferentes formas
    const userId = order.user?.id || order.userId;
    if (userId) {
      fetchUserDetails(userId);
    }
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedOrder(null);
    setSelectedUser(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No se encontró token de autenticación');
      return;
    }

    const datosAEnviar = {
      orderStatus: newStatus
    };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosAEnviar),
    };

    const URL = `http://localhost:4002/api/action/orders/${orderId}/status`;

    fetch(URL, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el estado');
        }
        return response.json();
      })
      .then((data) => {
        // Actualizar la orden en la lista local
        setOrderList(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, orderStatus: data.orderStatus } : order
          )
        );
      })
      .catch((error) => {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado de la orden');
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'warning';
      case 'EN_PREPARACION':
        return 'info';
      case 'ENVIADO':
        return 'secondary';
      case 'ENTREGADO':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_PREPARACION':
        return 'En Preparación';
      case 'ENVIADO':
        return 'Enviado';
      case 'ENTREGADO':
        return 'Entregado';
      default:
        return status;
    }
  };

  const handleFirstPage = () => {
    setPage(0);
  };

  const handleLastPage = () => {
    setPage(Math.max(0, totalPages - 1));
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  if (loading && orderList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Gestión de Órdenes</Typography>
        <Chip 
          label={`${totalElements} órdenes totales`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.light' }}>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {order.user?.email || 
                   order.user?.username || 
                   order.userEmail ||
                   (order.userId ? `Usuario ID: ${order.userId}` : 'Usuario no disponible')}
                </TableCell>
                <TableCell>
                  {order.orderDate ? new Date(order.orderDate).toLocaleString('es-AR') : 'N/A'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  ${order.importeTotal?.toLocaleString('es-AR') || '0'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.paymentMethod || 'N/A'} 
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={order.orderStatus || 'PENDIENTE'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                    sx={{
                      minWidth: 150,
                      '& .MuiSelect-select': {
                        py: 0.5,
                      }
                    }}
                  >
                    <MenuItem value="PENDIENTE">
                      <Chip label="Pendiente" color="warning" size="small" />
                    </MenuItem>
                    <MenuItem value="EN_PREPARACION">
                      <Chip label="En Preparación" color="info" size="small" />
                    </MenuItem>
                    <MenuItem value="ENVIADO">
                      <Chip label="Enviado" color="secondary" size="small" />
                    </MenuItem>
                    <MenuItem value="ENTREGADO">
                      <Chip label="Entregado" color="success" size="small" />
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalles">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleViewDetails(order)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Box>
            <Tooltip title="Primera página">
              <span>
                <IconButton
                  onClick={handleFirstPage}
                  disabled={page === 0 || loading}
                  color="primary"
                >
                  <FirstPageIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Button
              onClick={handlePrevPage}
              disabled={page === 0 || loading}
              sx={{ mx: 1 }}
            >
              Anterior
            </Button>
          </Box>
          
          <Chip 
            label={`Página ${page + 1} de ${totalPages || 1}`}
            color="primary"
          />
          
          <Box>
            <Button
              onClick={handleNextPage}
              disabled={page >= totalPages - 1 || loading}
              sx={{ mx: 1 }}
            >
              Siguiente
            </Button>
            <Tooltip title="Última página">
              <span>
                <IconButton
                  onClick={handleLastPage}
                  disabled={page >= totalPages - 1 || loading}
                  color="primary"
                >
                  <LastPageIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
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
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
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
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={getStatusLabel(selectedOrder.orderStatus)}
                  color={getStatusColor(selectedOrder.orderStatus)}
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

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Cliente
                  </Typography>
                </Box>
                {loadingUser ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : selectedUser ? (
                  <Box>
                    <Typography variant="body1">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                ) : selectedOrder.user ? (
                  <Box>
                    <Typography variant="body1">
                      {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.user.email}
                    </Typography>
                  </Box>
                ) : selectedOrder.userId ? (
                  <Typography variant="body2" color="text.secondary">
                    Usuario ID: {selectedOrder.userId}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Usuario no disponible
                  </Typography>
                )}
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCartIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Productos
                  </Typography>
                </Box>
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
    </Box>
  );
}
