import { useState,useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../interfaces/User';
import { saveUserToFirestore } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import {useLoading} from '../../context/LoadingContext'
import Swal from 'sweetalert2';


export const RegisterPage = () => {
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

  const isValidPassword = (password: string) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasMinLength = password.length > 5;
    return hasLetters && hasNumbers && hasMinLength;
  };

  const handleRegister = async () => {
    if (!isValidPassword(password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña inválida',
        text: 'Debe tener más de 5 caracteres y contener letras y números'
      });
      return;
    }

    try {
      showLoading();

      const cred = await registerUser(email, password);

      const userData: IUser = {
        uid: cred.user.uid,
        email: cred.user.email ?? '',
        createdAt: new Date()
      };

      await saveUserToFirestore(userData);

      // ✅ NO navegamos manualmente
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: 'No se pudo crear la cuenta'
      });
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" textAlign="center">
          Crear cuenta
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

        <Button variant="contained" onClick={handleRegister}>
          Registrarse
        </Button>

        <Button variant="text" onClick={() => navigate('/login')}>
          Ya tengo cuenta
        </Button>
      </Box>
    </Container>
  );
};