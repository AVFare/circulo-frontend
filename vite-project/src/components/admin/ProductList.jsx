import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ProductForm from "./ProductForm";

export default function ProductList({ onCloseDrawer }) {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    // Panel de admin: usa el endpoint que devuelve TODOS los productos (sin filtrar por status)
    fetch("http://localhost:4002/api/item/catalog/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar productos");
        return response.json();
      })
      .then((data) => {
        // Como este endpoint no está paginado, manejamos la paginación en el frontend
        setProductList(data);
        setTotalElements(data.length);
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
      });
  }, [refreshTrigger]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Soft delete: cambiar estado a DELETED
      const response = await fetch(
        `http://localhost:4002/api/item/products/${productToDelete}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 2 }), // 2 = DELETED
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      // Recargar la lista
      setRefreshTrigger((prev) => prev + 1);
      // Mostrar dialog de éxito en lugar de snackbar
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setSnackbarMessage("Error al eliminar el producto: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleProductSubmit = (productData) => {
    console.log("Producto guardado:", productData);
    // Recargar la lista de productos
    setRefreshTrigger((prev) => prev + 1);
    handleCloseEditModal();
    handleCloseCreateModal();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Gestión de Productos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.light" }}>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category || "N/A"}</TableCell>
                  <TableCell>
                    ${product.price.toLocaleString("es-AR")}
                  </TableCell>
                  <TableCell>{product.stock || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.status || "PUBLISHED"}
                      size="small"
                      color={
                        product.status === "PUBLISHED"
                          ? "success"
                          : product.status === "SOLD"
                          ? "info"
                          : product.status === "DELETED"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalle">
                      <IconButton
                        color="info"
                        onClick={() => {
                          if (onCloseDrawer) onCloseDrawer();
                          navigate(`/producto/${product.id}`);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {product.status !== "DELETED" && (
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(product)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {product.status !== "DELETED" && (
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Primera página">
              <span>
                <IconButton
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  size="small"
                >
                  <FirstPageIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Última página">
              <span>
                <IconButton
                  onClick={() =>
                    setPage(
                      Math.max(0, Math.ceil(totalElements / rowsPerPage) - 1)
                    )
                  }
                  disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
                  size="small"
                >
                  <LastPageIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            sx={{ border: "none" }}
          />
        </Box>
      </TableContainer>

      {/* Modal para editar producto */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
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
          Editar Producto
          <IconButton
            aria-label="close"
            onClick={handleCloseEditModal}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ProductForm
            product={selectedProduct}
            onSubmit={handleProductSubmit}
            onClose={handleCloseEditModal}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para crear producto */}
      <Dialog
        open={createModalOpen}
        onClose={handleCloseCreateModal}
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
            onClick={handleCloseCreateModal}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ProductForm
            onSubmit={handleProductSubmit}
            onClose={handleCloseCreateModal}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar (estilizado como el modal de editar) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        fullWidth
        maxWidth="sm"
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
          Confirmar eliminación
          <IconButton
            aria-label="close"
            onClick={handleCancelDelete}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            ¿Está seguro de que desea eliminar este producto?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Se marcará como DELETED.
          </Typography>
        </DialogContent>

        {/* Acciones con estilo similar al formulario: fondo y botones grandes */}
        <Box p={3} bgcolor="background.default" display="flex" gap={2}>
          <Button variant="outlined" fullWidth onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleConfirmDelete}
          >
            Eliminar
          </Button>
        </Box>
      </Dialog>

      {/* Dialog de éxito */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Producto eliminado
        </DialogTitle>
        <DialogContent>
          <Typography>Producto eliminado exitosamente.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setSuccessDialogOpen(false);
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
