import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper
} from '@mui/material';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../interfaces/User';
import { saveUserToFirestore } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
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
      // 🔥 navegación la maneja el auth listener
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
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* 🧠 Lado izquierdo - Imagen */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1530210124550-912dc1381cb8)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(0,0,0,0.55)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            color="white"
            textAlign="center"
            px={4}
          >
            Crowd-Brainstorm
          </Typography>
        </Box>
      </Box>

      {/* 📝 Lado derecho - Registro */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box mb={3}>
              <Typography variant="h5" fontWeight={600}>
                Sumate a Crowd-Brainstorm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creá tu cuenta y empezá a idear en equipo
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                helperText="Mínimo 6 caracteres, letras y números"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleRegister}
                disabled={!email || !password}
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Crear cuenta
              </Button>

              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Ya tengo cuenta
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
