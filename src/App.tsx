import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import ClientManagement from './components/ClientManagement';
import RoomManagement from './components/RoomManagement';
import ReservationManagement from './components/ReservationManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/clientes" element={<ClientManagement />} />
            <Route path="/habitaciones" element={<RoomManagement />} />
            <Route path="/reservas" element={<ReservationManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;