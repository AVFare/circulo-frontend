import { Card, CardActionArea, CardMedia, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ImageIcon from '@mui/icons-material/Image';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const isListMode = viewMode === 'list';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: isListMode ? 'row' : 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        maxWidth: '100%',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/producto/${product.id}`}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: isListMode ? 'row' : 'column',
          alignItems: 'stretch',
        }}
      >
        {/* Contenedor de imagen con altura fija */}
        <Box
          sx={{
            width: isListMode ? 200 : '100%',
            height: isListMode ? 'auto' : 200,
            minHeight: isListMode ? 200 : 200,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {product.img ? (
            <CardMedia
              component="img"
              image={product.img}
              alt={product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          ) : (
            <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack spacing={1}>
            {/* Precio con descuento */}
            {product.discount > 0 ? (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.disabled',
                      textDecoration: 'line-through',
                    }}
                  >
                    ${product.price.toLocaleString('es-AR')}
                  </Typography>
                  <Chip
                    label={`${product.discount}% OFF`}
                    size="small"
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      fontWeight: 'bold',
                      height: 20,
                      fontSize: '0.7rem',
                    }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>
                  ${(product.price * (1 - product.discount / 100)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ${product.price.toLocaleString('es-AR')}
              </Typography>
            )}

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
              {product.location && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocationOnOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {product.location}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}