import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/authSlice";
import RecyclingIcon from "@mui/icons-material/Recycling";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    document.title = 'Iniciar Sesión - CÍRCULO';
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
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
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
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
            variant="h4"
            sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}
          >
            CÍRCULO
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Bienvenido de nuevo
          </Typography>

          {location.state && location.state.registered && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registro exitoso. Podés iniciar sesión ahora.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
                disabled={loading}
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
                disabled={loading}
              />{" "}{/*  <TextField
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
              </TextField>  */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Iniciando..." : "Iniciar sesión"}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" sx={{ mt: 3 }}>
            ¿No tenés cuenta?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                fontWeight: 700,
                color: "#2D5016",
              }}
            >
              Registrate
            </Link>
          </Typography>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Continuar sin registrarse a ver los productos (debes estar registrado e iniciar sesión para comprar)
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => navigate('/inicio')}>
            Ver productos
          </Button>
        </Box>
      </Paper>
    </Container>
  </Box>
  );
}
