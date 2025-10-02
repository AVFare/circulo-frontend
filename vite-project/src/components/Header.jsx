import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import RecyclingIcon from "@mui/icons-material/Recycling";

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar>
        <RecyclingIcon sx={{ mr: 1, color: "#e8f7d6ff" }} fontSize="large" />
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          Círculo
        </Typography>

        {/* espacio flexible para futuros botones o links */}
        <Box sx={{ flexGrow: 1 }} />

        
       <Button color="inherit">LOG OUT</Button> {/* no tiene funcionalidad  */}
      </Toolbar>
    </AppBar>
  );
}
