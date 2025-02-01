import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hotel Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/clientes">
            Clientes
          </Button>
          <Button color="inherit" component={RouterLink} to="/habitaciones">
            Habitaciones
          </Button>
          <Button color="inherit" component={RouterLink} to="/reservas">
            Reservas
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;