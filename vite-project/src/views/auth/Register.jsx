import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    ROLE: "", 
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de registro:", form);
    // acá después vas a hacer el POST al backend
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e8f7d6ff",
      }}
    >
      <Paper
        elevation={6}
        sx={{ p: 4, borderRadius: 3, textAlign: "center", width: 360 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Crear cuenta
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Apellido"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Usuario"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
          />

          {/* Select para ROLE */}
          <TextField
            select
            fullWidth
            label="Rol"
            name="ROLE"
            value={form.ROLE}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Registrarse
          </Button>
        </form>

        {/* Link para volver al login */}
        <Typography variant="body2" sx={{ mt: 3 }}>
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#2e7d32",
            }}
          >
            Iniciá sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
