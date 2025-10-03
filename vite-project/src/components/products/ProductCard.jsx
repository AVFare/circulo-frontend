// src/components/products/ProductCard.jsx
import { Card, CardActionArea, CardMedia, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

export default function ProductCard({ product }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/producto/${product.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Imagen del producto */}
        <CardMedia
          component="img"
          height="200"
          image={product.img}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack spacing={1}>
            {/* Precio destacado */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${product.price.toLocaleString('es-AR')}
            </Typography>

            {/* Cuotas */}
            {product.installments && (
              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                {product.installments}
              </Typography>
            )}

            {/* Nombre del producto */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: 40,
              }}
            >
              {product.name}
            </Typography>

            {/* Envío gratis y ubicación */}
            <Box sx={{ pt: 1 }}>
              {product.freeShipping && (
                <Chip
                  icon={<LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Envío gratis"
                  size="small"
                  color="success"
                  sx={{ mb: 0.5 }}
                />
              )}
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {product.location}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}