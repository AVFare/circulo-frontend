import { Grid } from '@mui/material';
import ProductCard from './ProductCard.jsx';

export default function ProductsGrid({ products = [] }) {
  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}