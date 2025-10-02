import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <Box
      sx={{
        backgroundColor: "#e8f7d6ff", // verde claro de fondo
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
           // backgroundColor: "#b0c999ff",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            BIENVENIDO A CIRCULO
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
            Iniciar Sesión
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Entrar
          </Button>

          {/* Texto debajo */}
          <Typography variant="body2" sx={{ mt: 3 }}>
            ¿Sos nuevo por acá?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: "#2e7d32",
              }}
            >
              REGISTRATE
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
