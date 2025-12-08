import { Button, Typography, Container, Box } from '@mui/material';
import { logoutUser } from '@/auth/services/authService';
import { SessionsListPage } from './sessions/SessionsListPage';

export const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" mt={4}>
        Bienvenido a Crowd Brainstorm 🚀
      </Typography>

      <Button
        variant="contained"
        color="error"
        sx={{ mt: 2 }}
        onClick={logoutUser}
      >
        Cerrar sesión
      </Button>
       <Box p={3}>
      {/* <Typography variant="h4" mb={3}>Bienvenido al Dashboard</Typography> */}
      {/* Aquí mostramos la lista de sesiones */}
      <SessionsListPage />
    </Box>
    </Container>
  );
};
