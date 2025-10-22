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
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No se encontró token de autenticación');
      setLoading(false);
      return;
    }

    setLoading(true);
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const url = `http://localhost:4002/api/user/users?page=${page}&size=${rowsPerPage}&sortBy=id&sortDirection=asc`;

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }
        return response.json();
      })
      .then((data) => {
        setUserList(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener usuarios:', error);
        setError('No se pudieron cargar los usuarios');
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

    fetch(`http://localhost:4002/api/user/users/${userId}`, options)
      .then((response) => response.json())
      .then((user) => {
        setSelectedUser(user);
        setDetailModalOpen(true);
        
        setLoadingOrders(true);
        fetch(`http://localhost:4002/api/action/orders?page=0&size=100&sortBy=id&sortDirection=desc`, options)
          .then((response) => response.json())
          .then((data) => {
            const filteredOrders = (data.content || []).filter(order => order.userId === userId);
            setUserOrders(filteredOrders);
            setLoadingOrders(false);
          })
          .catch((error) => {
            console.error('Error al obtener órdenes del usuario:', error);
            setUserOrders([]);
            setLoadingOrders(false);
          });
      })
      .catch((error) => {
        console.error('Error al obtener detalles del usuario:', error);
      });
  };

  const handleViewDetails = (user) => {
    fetchUserDetails(user.id);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedUser(null);
    setUserOrders([]);
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

  if (loading && userList.length === 0) {
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

  const paginatedUsers = userList;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Gestión de Usuarios
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>@{user.name}</TableCell>
                <TableCell>{user.firstName || user.firstname}</TableCell>
                <TableCell>{user.lastName || user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role || 'USER'}
                    color={user.role === 'ADMIN' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
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
            Página {page + 1} de {totalPages} - Total: {totalElements} usuarios
          </Typography>
        </Box>
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
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Usuario
                    </Typography>
                    <Typography variant="h6">
                      @{selectedUser.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.firstName || selectedUser.firstname}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Apellido
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.lastName || selectedUser.lastname}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {selectedUser.phoneNumber && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.phoneNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {selectedUser.address && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingBagIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Órdenes del Usuario
                  </Typography>
                </Box>
                {loadingOrders ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : userOrders.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Este usuario no tiene órdenes
                  </Typography>
                ) : (
                  <List>
                    {userOrders.map((order) => (
                      <ListItem key={order.id}>
                        <ListItemText
                          primary={`Orden #${order.id}`}
                          secondary={
                            <>
                              Fecha: {new Date(order.date).toLocaleDateString('es-AR')} - 
                              Total: ${order.total?.toLocaleString('es-AR')} - 
                              <Chip
                                label={getStatusLabel(order.status)}
                                color={getStatusColor(order.status)}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}