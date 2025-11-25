import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { Link, useNavigate } from "react-router-dom";
import RecyclingIcon from "@mui/icons-material/Recycling";

// ...existing code...

export default function PasswordChange() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const userInfo = useSelector((state) => state.user.profile);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Cambiar Contraseña - CÍRCULO';
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getUserId = () => {
    try {
      const candidate = userInfo?.id ?? userInfo?.userId ?? null;
      if (candidate != null) {
        const n = Number(candidate);
        if (!Number.isNaN(n) && Number.isFinite(n)) return n;
      }
    } catch (err) {
      /* ignore */
    }

    // fallback: intentar decodificar el payload del JWT (access_token) y extraer id numérico
    try {
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const candidate = payload?.id ?? payload?.sub ?? payload?.userId ?? null;
      if (candidate != null) {
        const n = Number(candidate);
        if (!Number.isNaN(n) && Number.isFinite(n)) return n;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const id = getUserId();
    // aceptar 0 como id válido, pero rechazar null/undefined o no-numéricos
    if (id === null || id === undefined || Number.isNaN(Number(id))) {
      setError("No se pudo determinar un id numérico del usuario. Iniciá sesión nuevamente.");
      return;
    }

    setLoading(true);

    const datosAEnviar = {
      password: form.password,
    };

    const options = {
      method: "PUT", // ajustar a PATCH si el backend espera PATCH
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(datosAEnviar),
    };

    const URL = `http://localhost:4002/api/user/users/update/${id}`;

    fetch(URL, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cambiar la contraseña");
        }
        return response.text(); // el backend responde 200 sin cuerpo; leer texto para no fallar
      })
      .then(() => {
        setSuccess(true);
        // redirigir o notificar; por ahora redirijo al inicio después de un breve delay
        setTimeout(() => {
          navigate("/inicio");
        }, 900);
      })
      .catch((error) => {
        console.error("Error al cambiar contraseña: ", error);
        setError("Error al cambiar la contraseña. Intenta nuevamente.");
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
            Cambio de contraseña
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Contraseña cambiada correctamente. Redirigiendo...
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
                label="Nueva contraseña"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Repita la nueva contraseña"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                variant="outlined"
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
                {loading ? "Cambiando..." : "Cambiar contraseña"}
              </Button>
            </Stack>
          </form>
          <Typography variant="body2" sx={{ mt: 3 }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                fontWeight: 700,
                color: "#2D5016",
              }}
            >
              Volver
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}