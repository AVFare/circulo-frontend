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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LoginIcon from '@mui/icons-material/Login';
import { users } from '../../mock/users';
import { orders } from '../../mock/orders';

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    setUserList(users);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    // Filtrar órdenes del usuario
    const userOrdersList = orders.filter(order => order.userId === user.id);
    setUserOrders(userOrdersList);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedUser(null);
    setUserOrders([]);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'seller':
        return 'warning';
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Gestión de Usuarios</Typography>
        <Chip 
          label={`${userList.length} usuarios registrados`}
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
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Registrado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.toUpperCase()} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.registeredAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalles">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleViewDetails(user)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={userList.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>

      {/* Modal de detalles del usuario */}
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
          Detalles del Usuario
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedUser && (
            <Box>
              {/* Información del usuario */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Información Personal
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Usuario</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedUser.username}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Nombre Completo</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {`${selectedUser.firstname} ${selectedUser.lastname}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{selectedUser.email}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                        <Typography variant="body1">{selectedUser.phone}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Dirección</Typography>
                        <Typography variant="body1">
                          {`${selectedUser.address}, ${selectedUser.city}, CP: ${selectedUser.zipCode}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Fecha de Registro</Typography>
                        <Typography variant="body1">{formatDate(selectedUser.registeredAt)}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LoginIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Último Acceso</Typography>
                        <Typography variant="body1">{formatDate(selectedUser.lastLogin)}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Rol</Typography>
                    <Chip 
                      label={selectedUser.role.toUpperCase()} 
                      color={getRoleColor(selectedUser.role)}
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Órdenes del usuario */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Historial de Órdenes ({userOrders.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {userOrders.length > 0 ? (
                  <Box>
                    {userOrders.map((order) => (
                      <Box 
                        key={order.id} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          border: '1px solid', 
                          borderColor: 'divider',
                          borderRadius: 1 
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            Orden #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(order.orderDate)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {order.items.length} producto(s) - Total: ${order.total.toLocaleString('es-AR')}
                        </Typography>
                        <Chip 
                          label={order.status.toUpperCase()} 
                          size="small"
                          color={order.status === 'delivered' ? 'success' : 
                                 order.status === 'cancelled' ? 'error' : 'warning'}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Este usuario no tiene órdenes registradas.
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}