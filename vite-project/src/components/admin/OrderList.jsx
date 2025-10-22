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
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { orders } from '../../mock/orders';

export default function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrderList(orders);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      credit_card: 'Tarjeta de Crédito',
      debit_card: 'Tarjeta de Débito',
      mercadopago: 'Mercado Pago',
      cash: 'Efectivo'
    };
    return methods[method] || method;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Gestión de Órdenes</Typography>
        <Chip 
          label={`${orderList.length} órdenes totales`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.light' }}>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell fontWeight={600}>
                    ${order.total.toLocaleString('es-AR')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status.toUpperCase()} 
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.paymentStatus.toUpperCase()} 
                      color={getPaymentStatusColor(order.paymentStatus)}
                      size="small"
                      variant="outlined"
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
              ))}
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
                  onClick={() => setPage(Math.max(0, Math.ceil(orderList.length / rowsPerPage) - 1))} 
                  disabled={page >= Math.ceil(orderList.length / rowsPerPage) - 1}
                  size="small"
                >
                  <LastPageIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <TablePagination
            component="div"
            count={orderList.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            sx={{ border: 'none' }}
          />
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
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedOrder && (
            <Box>
              {/* Información del cliente */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Cliente
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Nombre</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedOrder.userName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{selectedOrder.userEmail}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Información de la orden */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingCartIcon />
                  Productos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {selectedOrder.items.map((item, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemText
                        primary={item.productName}
                        secondary={`Cantidad: ${item.quantity}`}
                      />
                      <Typography variant="body1" fontWeight={600}>
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2, pt: 2, borderTop: '2px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      ${selectedOrder.total.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Información de envío */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon />
                  Dirección de Envío
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  {selectedOrder.shippingAddress.address}
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.shippingAddress.city}, CP: {selectedOrder.shippingAddress.zipCode}
                </Typography>
              </Paper>

              {/* Información de pago */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon />
                  Información de Pago
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Método de Pago</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Estado del Pago</Typography>
                    <Chip 
                      label={selectedOrder.paymentStatus.toUpperCase()} 
                      color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Estado de la Orden</Typography>
                    <Chip 
                      label={selectedOrder.status.toUpperCase()} 
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Fecha de Orden</Typography>
                    <Typography variant="body1">{formatDate(selectedOrder.orderDate)}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}