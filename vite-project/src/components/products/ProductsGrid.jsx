import { Grid, Box } from '@mui/material';
import ProductCard from './ProductCard.jsx';

export default function ProductsGrid({ products = [], viewMode = 'grid' }) {
  // En modo lista, cada producto ocupa toda la fila
  // En modo grid, 4 productos por fila en pantallas grandes
  const gridSize = viewMode === 'list' 
    ? { xs: 12 }
    : { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product.id} item {...gridSize}>
            <ProductCard product={product} viewMode={viewMode} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}