import { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  /* const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Error al iniciar sesión');
      console.error(error);
    }
  }; */
  const handleLogin = async () => {
  try {
    await loginUser(email, password);
    navigate('/dashboard');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al iniciar sesión',
      text: 'Email o contraseña incorrectos'
    });
    console.error(error);
  }
};

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" textAlign="center">
          Iniciar sesión
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" onClick={handleLogin}>
          Entrar
        </Button>

        <Button variant="text" onClick={() => navigate('/register')}>
          Crear cuenta
        </Button>
      </Box>
    </Container>
  );
};
