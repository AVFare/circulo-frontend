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
import RecyclingIcon from "@mui/icons-material/Recycling";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Iniciar Sesión - CÍRCULO';
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const datosAEnviar = {
      email: form.email,
      password: form.password,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosAEnviar),
    };

    const URL = "http://localhost:4002/api/v1/auth/login";

    fetch(URL, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al iniciar sesión");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login exitoso:", data);

        // Guardar el token en localStorage
        const token = data.access_token || data.accessToken;
        if (token) localStorage.setItem("access_token", token);

        // Extraer id del response o del token y guardar como const
        let id = null;
        try {
          id = data?.id ?? data?.userId ?? data?.user?.id ?? null;
          if (id != null) {
            const n = Number(id);
            if (!Number.isNaN(n) && Number.isFinite(n)) id = n; else id = null;
          }
        } catch (err) {
          id = null;
        }

        // Guardar información del usuario (email, role y id numérico si lo tenemos)
        const userInfo = {
          email: form.email,
          role: data.role,
        };
        const userId = id;
        if (userId != null) userInfo.id = userId;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Redirigir al home (ajusta la ruta según tu app)
        navigate("/inicio");
      })
      .catch((error) => {
        console.error("Error al iniciar sesión: ", error);
        setError("Credenciales inválidas. Intenta nuevamente.");
      })
      .finally(() => {
        setLoading(false);
      });
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
