import {
  Drawer, Box, Typography, IconButton, Divider, Button, TextField, Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function CartDrawer({ open, onClose, items = [], onRemove, onChangeQty }) {
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 380 } }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>Tu carrito</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: "grid", gap: 2 }}>
        {items.length === 0 && (
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            No tenés productos en el carrito.
          </Typography>
        )}
        {items.map((i) => (
          <Box key={i.id} sx={{ display: "flex", gap: 1 }}>
            <img src={i.img} alt={i.name} width={64} height={64} style={{ borderRadius: 8, objectFit: "cover" }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>{i.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                ${i.price.toLocaleString("es-AR")}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={i.qty}
                  onChange={(e) => onChangeQty(i.id, Number(e.target.value))}
                  sx={{ width: 80 }}
                />
                <IconButton color="error" onClick={() => onRemove(i.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>
          Total: ${total.toLocaleString("es-AR")}
        </Typography>
        <Button variant="contained" color="success" fullWidth disabled={items.length === 0}>
          Ir a pagar
        </Button>
      </Box>
    </Drawer>
  );
}
