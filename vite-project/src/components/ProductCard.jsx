import { Card, CardActionArea, CardMedia, CardContent, Stack, Typography, Chip } from "@mui/material";
import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  return (
    <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
      <CardActionArea component={Link} to={`/producto/${p.id}`}>
        <CardMedia component="img"  image={p.img} alt={p.name} />
        <CardContent>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              ${p.price.toLocaleString("es-AR")}
            </Typography>
            {p.installments && (
              <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600 }}>
                {p.installments}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {p.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              {p.freeShipping && <Chip size="small" color="success" label="Envío gratis" />}
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {p.location}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
