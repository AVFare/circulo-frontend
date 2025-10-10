import { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', form);
    navigate('/inicio');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #DDFFBC 0%, #91AC8F 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >

            <RecyclingIcon
            sx = {{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 50
                
            }}
            />

          </Box>

       
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
            CÍRCULO
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Bienvenido de nuevo
          </Typography>

      
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Iniciar sesión
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" sx={{ mt: 3 }}>
            ¿No tenés cuenta?{' '}
            <Link
              to="/register"
              style={{
                textDecoration: 'none',
                fontWeight: 700,
                color: '#2D5016',
              }}
            >
              Registrate gratis
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}