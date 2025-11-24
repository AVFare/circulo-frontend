import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/userSlice";
import RecyclingIcon from "@mui/icons-material/Recycling";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });

  // Para resaltar campo si el mensaje del backend lo menciona
  const emailHasError = /email/i.test(error);
  const usernameHasError = /usuario|username/i.test(error);

  useEffect(() => {
    document.title = "Crear Cuenta - CÍRCULO";
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate("/inicio");
    }
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nombre"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Apellido"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              error={emailHasError}
              helperText={emailHasError ? error : ""}
            />

            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={loading}
              error={usernameHasError}
              helperText={usernameHasError ? error : ""}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
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
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Continuar sin registrarse a ver los productos (debes estar registrado e iniciar sesión para comprar)
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => navigate("/inicio")}>
            Ver productos
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
