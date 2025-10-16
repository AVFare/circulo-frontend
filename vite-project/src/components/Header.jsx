import { AppBar, Toolbar, Typography, Box, InputBase, alpha, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useState, useEffect } from 'react';
import AdminDrawer from './admin/AdminDrawer';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar datos de usuario del localStorage
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {/* Mostrar AdminDrawer solo para usuarios admin */}
            {user && user.role === 'admin' && (
              <AdminDrawer onNavigate={(section) => {
                // Aquí podrías manejar la navegación o abrir modales según la sección
              }} />
            )}

            {/* Logo q usamos en toda la app: MATERIAL UI CODED  */}
            <Typography
              variant="h6"
              component={Link}
              to="/inicio"
              sx={{
                fontWeight: 800,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <RecyclingIcon />
               CÍRCULO
            </Typography>

            {/* buscador !!!!! */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar productos ecológicos..."
                inputProps={{ 'aria-label': 'buscar' }}
              />
            </Search>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}