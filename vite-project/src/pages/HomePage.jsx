import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  TextField, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  InputAdornment,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ProductsGrid from '../components/products/ProductsGrid.jsx';

const CATEGORIES = [
  'REMERAS',
  'PANTALONES',
  'VESTIDOS',
  'MEDIAS',
  'CALZADO',
  'ABRIGO',
  'MALLAS',
];

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useOutletContext();
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  
  // Estados de datos
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sincronizar búsqueda desde URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  // Fetch productos con filtros
  useEffect(() => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('size', pageSize);
    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);
    
    if (searchTerm) params.append('name', searchTerm);
    if (selectedCategory) params.append('category', selectedCategory);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (showOnlyDiscounted) params.append('hasDiscount', 'true');
    // Catálogo público: solo mostrar productos con stock
    params.append('inStock', 'true');

    const URL = `http://localhost:4002/api/item/catalog/products/search?${params.toString()}`;

    fetch(URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar productos');
        return response.json();
      })
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Error al cargar los productos. Intenta nuevamente.');
        setLoading(false);
      });
  }, [currentPage, pageSize, sortBy, sortDirection, searchTerm, selectedCategory, minPrice, maxPrice, showOnlyDiscounted]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setShowOnlyDiscounted(false);
    setSortBy('id');
    setSortDirection('asc');
    setCurrentPage(0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'price-asc') {
      setSortBy('price');
      setSortDirection('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortDirection('desc');
    } else if (value === 'discount-desc') {
      setSortBy('discount');
      setSortDirection('desc');
    } else if (value === 'discount-asc') {
      setSortBy('discount');
      setSortDirection('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortDirection('desc');
    } else if (value === 'name-asc') {
      setSortBy('name');
      setSortDirection('asc');
    } else if (value === 'name-desc') {
      setSortBy('name');
      setSortDirection('desc');
    } else {
      setSortBy('id');
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setCurrentPage(0);
  };

  const getSortValue = () => {
    if (sortBy === 'price' && sortDirection === 'asc') return 'price-asc';
    if (sortBy === 'price' && sortDirection === 'desc') return 'price-desc';
    if (sortBy === 'discount' && sortDirection === 'desc') return 'discount-desc';
    if (sortBy === 'discount' && sortDirection === 'asc') return 'discount-asc';
    if (sortBy === 'name' && sortDirection === 'asc') return 'name-asc';
    if (sortBy === 'name' && sortDirection === 'desc') return 'name-desc';
    return 'default';
  };

  const activeFiltersCount = [searchTerm, selectedCategory, minPrice, maxPrice, showOnlyDiscounted].filter(Boolean).length;

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Catálogo de Productos
          </Typography>

          {/* Barra de filtros consolidada */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Categoría */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Categoría"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(0);
                    }}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return '________';
                      }
                      return selected;
                    }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Precio mínimo */}
              <Grid item xs={6} sm={6} md={1.5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Precio mín."
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(0);
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Precio máximo */}
              <Grid item xs={6} sm={6} md={1.5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Precio máx."
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(0);
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Ordenar */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={getSortValue()}
                    label="Ordenar por"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="default">Por defecto</MenuItem>
                    <MenuItem value="price-asc">Precio ↑</MenuItem>
                    <MenuItem value="price-desc">Precio ↓</MenuItem>
                    <MenuItem value="discount-desc">Mayor Descuento</MenuItem>
                    <MenuItem value="discount-asc">Menor Descuento</MenuItem>
                    <MenuItem value="name-asc">Nombre A-Z</MenuItem>
                    <MenuItem value="name-desc">Nombre Z-A</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Filtro de descuento */}
              <Grid item xs={6} sm={6} md={1.5}>
                <Button
                  fullWidth
                  variant={showOnlyDiscounted ? "contained" : "outlined"}
                  size="small"
                  color={showOnlyDiscounted ? "success" : "primary"}
                  onClick={() => {
                    setShowOnlyDiscounted(!showOnlyDiscounted);
                    setCurrentPage(0);
                  }}
                  startIcon={<LocalOfferIcon />}
                  sx={{ height: '40px' }}
                >
                  {showOnlyDiscounted ? 'Con OFF' : 'Con OFF'}
                </Button>
              </Grid>

              {/* Items por página */}
              <Grid item xs={6} sm={3} md={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Mostrar</InputLabel>
                  <Select
                    value={pageSize}
                    label="Mostrar"
                    onChange={handlePageSizeChange}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem key={size} value={size}>{size}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Limpiar */}
              <Grid item xs={12} sm={12} md={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  disabled={activeFiltersCount === 0}
                  sx={{ height: '40px' }}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Filtros activos con chips */}
          {activeFiltersCount > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', fontWeight: 600 }}>
                Filtros activos:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`"${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  size="small"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={selectedCategory}
                  onDelete={() => setSelectedCategory('')}
                  color="primary"
                  size="small"
                />
              )}
              {minPrice && (
                <Chip
                  label={`Desde $${minPrice}`}
                  onDelete={() => setMinPrice('')}
                  color="primary"
                  size="small"
                />
              )}
              {maxPrice && (
                <Chip
                  label={`Hasta $${maxPrice}`}
                  onDelete={() => setMaxPrice('')}
                  color="primary"
                  size="small"
                />
              )}
              {showOnlyDiscounted && (
                <Chip
                  label="Solo con descuento"
                  onDelete={() => setShowOnlyDiscounted(false)}
                  color="success"
                  size="small"
                  icon={<LocalOfferIcon />}
                />
              )}
            </Stack>
          )}

          {/* Información de resultados */}
          {!loading && !error && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {totalElements > 0 ? (
                  <>
                    Mostrando <strong>{currentPage * pageSize + 1}</strong> - <strong>{Math.min((currentPage + 1) * pageSize, totalElements)}</strong> de <strong>{totalElements}</strong> productos
                  </>
                ) : (
                  'No hay productos'
                )}
              </Typography>
              {totalPages > 1 && (
                <Typography variant="body2" color="text.secondary">
                  Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
                </Typography>
              )}
            </Box>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Grid de productos */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <ProductsGrid products={products} viewMode={viewMode} />
              ) : (
                <Paper sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se encontraron productos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta ajustar los filtros de búsqueda
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    sx={{ mt: 2 }}
                  >
                    Limpiar filtros
                  </Button>
                </Paper>
              )}
            </>
          )}

          {/* Paginación */}
          {!loading && !error && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}