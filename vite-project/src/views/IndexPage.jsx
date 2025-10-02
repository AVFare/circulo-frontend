// src/views/IndexPage.jsx
//import { useOutletContext } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import ProductsGrid from "../components/ProductsGrid.jsx";
import { products } from '../mock/products.js'

export default function IndexPage() {
  // si querés usar addToCart desde el layout:
  //const { addToCart } = useOutletContext?.() || {};

  return (
    <Box sx={{ py: 3, background: "#f7f9f8", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Productos
        </Typography>
        <ProductsGrid products={products} />
      </Container>
    </Box>
  );
}
