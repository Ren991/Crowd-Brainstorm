import { Button, Typography, Container } from '@mui/material';
import { logoutUser } from '@/auth/services/authService';

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
    </Container>
  );
};
