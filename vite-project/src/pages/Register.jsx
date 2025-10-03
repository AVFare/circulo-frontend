// src/pages/Register.jsx
import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, MenuItem, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registro:', form);
    // Simulamos registro exitoso
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #91AC8F 0%, #52734D 100%)',
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          width: '100%',
          maxWidth: 420,
          mx: 2,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <Typography variant="h5">🌱</Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'primary.main' }}>
          Crear cuenta
        </Typography>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nombre"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Apellido"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <TextField
              select
              fullWidth
              label="Rol"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="USER">Usuario</MenuItem>
              <MenuItem value="ADMIN">Administrador</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Registrarse
            </Button>
          </Stack>
        </form>

        {/* Link a login */}
        <Typography variant="body2" sx={{ mt: 3 }}>
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              fontWeight: 700,
              color: '#2D5016',
            }}
          >
            Iniciá sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}