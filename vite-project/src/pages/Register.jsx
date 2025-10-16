import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import RecyclingIcon from "@mui/icons-material/Recycling";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registro:", form);
      
      // Guardar el token y el rol en localStorage
      localStorage.setItem('form', form);

      
      // Opcional: guardar también los datos del usuario (sin contraseña)
      const userInfo = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        username: form.username,
        role:'user'
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      navigate("/");
   
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #DDFFBC 0%, #91AC8F 100%)",
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          width: "100%",
          maxWidth: 420,
          mx: 2,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 2,
          }}
        >
          <RecyclingIcon
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: 50,
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, mb: 3, color: "primary.main" }}
        >
          Crear cuenta
        </Typography>

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

        <Typography variant="body2" sx={{ mt: 3 }}>
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: 700,
              color: "#2D5016",
            }}
          >
            Iniciá sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}