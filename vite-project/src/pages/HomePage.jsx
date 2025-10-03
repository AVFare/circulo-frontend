// src/pages/HomePage.jsx
import { useState, useMemo } from 'react';
import { Box, Container, Typography, Stack, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import ProductsGrid from '../components/products/ProductsGrid.jsx';
import { products } from '../mock/products.js';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

export default function HomePage() {
  const [freeShippingFilter, setFreeShippingFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro de envío gratis
    if (freeShippingFilter) {
      result = result.filter((p) => p.freeShipping);
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [freeShippingFilter, sortBy]);

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header de la página */}
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Productos Ecológicos
          </Typography>

          {/* Filtros */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {/* Filtro de envío gratis */}
            <Chip
              icon={<LocalShippingOutlinedIcon />}
              label="Envío gratis"
              onClick={() => setFreeShippingFilter(!freeShippingFilter)}
              color={freeShippingFilter ? 'success' : 'default'}
              variant={freeShippingFilter ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />

            {/* Ordenamiento */}
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(e, newSort) => newSort && setSortBy(newSort)}
              size="small"
              sx={{ flexWrap: 'wrap' }}
            >
              <ToggleButton value="default">Por defecto</ToggleButton>
              <ToggleButton value="price-asc">Menor precio</ToggleButton>
              <ToggleButton value="price-desc">Mayor precio</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {/* Contador de resultados */}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </Typography>

          {/* Grid de productos */}
          <ProductsGrid products={filteredProducts} />
        </Stack>
      </Container>
    </Box>
  );
}