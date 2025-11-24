import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import ProductForm from "./admin/ProductForm";
import ProductList from "./admin/ProductList";
import UserList from "./admin/UserList";
import OrderList from "./admin/OrderList";
import { fetchProfile } from "../redux/userSlice";

export default function UserMenu() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productListModalOpen, setProductListModalOpen] = useState(false);
  const [userListModalOpen, setUserListModalOpen] = useState(false);
  const [orderListModalOpen, setOrderListModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setUser((prev) => ({ ...prev, ...profile }));
      localStorage.setItem("userInfo", JSON.stringify({ ...profile }));
    }
  }, [profile]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/perfil");
    handleClose();
  };

  const handleOrders = () => {
    navigate("/mis-ordenes");
    handleClose();
  };

  const handleChangePassword = () => {
    navigate("/cambiar-contrasena");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("access_token");
    navigate("/");
    handleClose();
  };

  const handleAdminAction = (action) => {
    handleClose();
    if (action === "createProduct") {
      setProductModalOpen(true);
    } else if (action === "productList") {
      setProductListModalOpen(true);
    } else if (action === "users") {
      setUserListModalOpen(true);
    } else if (action === "orders") {
      setOrderListModalOpen(true);
    }
  };

  const handleProductSubmit = () => {
    setProductModalOpen(false);
    setSnackbar({
      open: true,
      message: "Producto creado con éxito",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!user) return null;

  const firstName =
    user.firstName || user.firstname || user.name?.split(" ")[0] || "";
  const lastName =
    user.lastName ||
    user.lastname ||
    (user.name?.split(" ").length > 1
      ? user.name?.split(" ").slice(-1)[0]
      : "");
  const displayName = `${firstName} ${lastName}`.trim();

  const getAvatarInitials = () => {
    const firstInitial = firstName?.trim().charAt(0) || "";
    const lastInitial = lastName?.trim().charAt(0) || "";
    let initials = `${firstInitial}${lastInitial}`.toUpperCase().trim();
    {
      console.log("first inirial last initial", firstInitial,lastInitial, initials);
    }

    if (!initials) {
      return (user.email?.slice(0, 2) || "US").toUpperCase();
    }

    if (initials.length === 1) {
      const fallback =
        firstName?.trim().charAt(1) ||
        lastName?.trim().charAt(1) ||
        user.email?.charAt(1) ||
        "X";
      initials = `${initials}${fallback}`.slice(0, 2).toUpperCase();
    }

    return initials;
  };

  const avatarInitials = getAvatarInitials();
  const isAdmin = user.role === "ADMIN";

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "secondary.main",
            fontWeight: 700,
          }}
        >
          {avatarInitials.toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: 230,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
      >
        <Box
          sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "secondary.main",
              fontWeight: 700,
            }}
          >
            {avatarInitials}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {displayName || user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        {!isAdmin && (
          <MenuItem onClick={handleOrders}>
            <ListItemIcon>
              <ShoppingBagIcon fontSize="small" />
            </ListItemIcon>
            Mis Órdenes
          </MenuItem>
        )}
        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          Cambiar Contraseña
        </MenuItem>

        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Panel administrativo
              </Typography>
            </Box>
            <MenuItem onClick={() => handleAdminAction("createProduct")}>
              <ListItemIcon>
                <InventoryIcon fontSize="small" />
              </ListItemIcon>
              Crear Producto
            </MenuItem>
            <MenuItem onClick={() => handleAdminAction("productList")}>
              <ListItemIcon>
                <ListAltIcon fontSize="small" />
              </ListItemIcon>
              Ver Productos
            </MenuItem>
            <MenuItem onClick={() => handleAdminAction("users")}>
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              Usuarios
            </MenuItem>
            <MenuItem onClick={() => handleAdminAction("orders")}>
              <ListItemIcon>
                <ShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              Órdenes
            </MenuItem>
          </>
        )}

        <Divider sx={{ mt: 1 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Modales administrativos */}
      <Dialog
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Crear Nuevo Producto
          <IconButton
            aria-label="close"
            onClick={() => setProductModalOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ProductForm
            onSubmit={handleProductSubmit}
            onClose={() => setProductModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={productListModalOpen}
        onClose={() => setProductListModalOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Gestión de Productos
          <IconButton
            aria-label="close"
            onClick={() => setProductListModalOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ProductList onCloseDrawer={() => setProductListModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={userListModalOpen}
        onClose={() => setUserListModalOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Gestión de Usuarios
          <IconButton
            aria-label="close"
            onClick={() => setUserListModalOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <UserList />
        </DialogContent>
      </Dialog>

      <Dialog
        open={orderListModalOpen}
        onClose={() => setOrderListModalOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Gestión de Órdenes
          <IconButton
            aria-label="close"
            onClick={() => setOrderListModalOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <OrderList />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
