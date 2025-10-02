import { Grid } from "@mui/material";
import ProductCard from "./ProductCard.jsx";

export default function ProductsGrid({ products = [] }) {
  return (
    <Grid container spacing={2}>
      {products.map((p) => (
        <Grid key={p.id} item xs={12} sm={6} md={4} lg={3}>
          <ProductCard p={p} />
        </Grid>
      ))}
    </Grid>
  );
}
