import { useState,useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {useLoading} from '../../context/LoadingContext'
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();


useEffect(() => {
  if (user) {
    navigate('/dashboard');
  }
}, [user, navigate]);

const handleLogin = async () => {
  try {
    showLoading();

    await loginUser(email, password);

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Credenciales inválidas',
      text: 'Email o contraseña incorrectos'
    });
  } finally {
    hideLoading();
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
