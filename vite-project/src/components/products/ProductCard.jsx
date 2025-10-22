import { Card, CardActionArea, CardMedia, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ImageIcon from '@mui/icons-material/Image';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const isListMode = viewMode === 'list';

  const getImageSrc = (imageData) => {
    if (!imageData) return null;

    try {
      // Decodificar el string base64 que viene del backend
      const decodedData = atob(imageData);
      // Extraer la parte después del prefijo 'data:image/'
      const dataIndex = decodedData.indexOf('data:image/');
      if (dataIndex !== -1) {
        // Si encuentra el prefijo, retorna el string decodificado
        return decodedData;
      } else {
        // Si no encuentra el prefijo, asume que es un base64 puro y añade el prefijo
        return `data:image/png;base64,${imageData}`;
      }
    } catch (error) {
      console.error('Error procesando imagen:', error);
      return null;
    }
  };

  return (
    <Card
      sx={{
        width: 300, // Ancho fijo
        height: 320, // Altura fija
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        backgroundColor: '#fff',
        flexShrink: 0, // Evita que la card se encoja
        flexGrow: 0, // Evita que la card se expanda
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
            width: '100%',
            height: 180, // Altura fija más compacta para la imagen
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {product.imageData ? (
            <CardMedia
              component="img"
              image={getImageSrc(product.imageData)}
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

        <CardContent sx={{ p: 2, height: 140, overflow: 'hidden' }}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${product.price.toLocaleString('es-AR')}
            </Typography>

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