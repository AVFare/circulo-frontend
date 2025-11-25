import { Grid, Box } from '@mui/material';
import ProductCard from './ProductCard.jsx';

export default function ProductsGrid({ products = [], viewMode = 'grid' }) {
  // En modo lista, cada producto ocupa toda la fila
  // En modo grid, 4 productos por fila en pantallas grandes
  const gridSize = viewMode === 'list' 
    ? { xs: 12 }
    : { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 };

  return (
    <Box sx={{ width: '100%', padding: '0 32px' }}>
      <Grid 
        container 
        spacing={2}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, 300px)', // Tamaño fijo de card
          gap: '32px',
          justifyContent: 'center', // Centra las cards cuando no caben todas
          '& > .MuiGrid-item': {
            width: '300px', // Ancho fijo para cada item
            margin: 0,
            display: 'flex',
            justifyContent: 'center',
          }
        }}
      >
        {products.map((product) => (
          <Grid 
            key={product.id}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}