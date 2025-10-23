import { AppBar, Toolbar, Typography, Box, InputBase, alpha, Container, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useState, useEffect } from 'react';
import AdminDrawer from './admin/AdminDrawer';
import UserMenu from './UserMenu';

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
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
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

export default function Header({ onSearch }) {
  const [user, setUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/inicio';

  useEffect(() => {
    // Recuperar datos de usuario del localStorage
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      if (isHomePage && onSearch) {
        onSearch(searchValue.trim());
      } else {
        navigate(`/inicio?search=${encodeURIComponent(searchValue.trim())}`);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (isHomePage && onSearch) {
      onSearch('');
    }
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      if (isHomePage && onSearch) {
        onSearch(searchValue.trim());
      } else {
        navigate(`/inicio?search=${encodeURIComponent(searchValue.trim())}`);
      }
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {/* Mostrar AdminDrawer solo para usuarios admin */}
            {user && user.role === 'ADMIN' && (
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
                <IconButton 
                  size="small" 
                  onClick={handleSearchClick}
                  sx={{ color: 'inherit' }}
                >
                  <SearchIcon />
                </IconButton>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar productos ecológicos..."
                inputProps={{ 'aria-label': 'buscar' }}
                value={searchValue}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
              />
              {searchValue && (
                <IconButton 
                  size="small" 
                  onClick={handleClearSearch}
                  sx={{ color: 'inherit', mr: 1 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Search>
          </Box>

          {localStorage.getItem('userInfo') && localStorage.getItem('access_token') ? (
            <UserMenu />
          ) : (
            <Box sx={{ ml: 2 }}>
              <a href="/" style={{ textDecoration: 'none' }}>
                <button
                  class="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium MuiButton-colorPrimary"
                  type="button"
                  style={{
                    fontWeight: 'bold',
                    background: '#fff',
                    color: '#35571c',
                    border: '1px solid #35571c',
                    padding: '8px 16px',
                    borderRadius: '12px'
                  }}
                >
                  Iniciar Sesión
                </button>
              </a>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}