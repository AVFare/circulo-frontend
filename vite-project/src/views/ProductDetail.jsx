import { useParams } from "react-router-dom";
import { products } from "../mock/products"
import { Box, Container, Grid, Paper, Typography, Button, Chip, Stack } from "@mui/material";

export default function ProductDetail() {
  const { id } = useParams();
  const p = products.find((x) => String(x.id) === id);

  if (!p) return <Container sx={{ py: 4 }}><Typography>Producto no encontrado.</Typography></Container>;

  return (
    <Box sx={{ py: 3, background: "#f7f9f8", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", borderRadius: 8, objectFit: "cover" }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: "#fff" }}>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {p.location}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ${p.price.toLocaleString("es-AR")}
                </Typography>
                {p.installments && (
                  <Typography variant="body1" sx={{ color: "success.main", fontWeight: 600 }}>
                    {p.installments}
                  </Typography>
                )}
                <Stack direction="row" spacing={1}>
                  {p.freeShipping && <Chip color="success" label="Envío gratis" />}
                </Stack>

                <Button size="large" variant="contained" color="success" sx={{ mt: 2, borderRadius: 2 }}>
                  Agregar al carrito
                </Button>

                <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                  Descripción: producto eco-friendly de excelente calidad. (Acá va el detalle real del backend).
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
