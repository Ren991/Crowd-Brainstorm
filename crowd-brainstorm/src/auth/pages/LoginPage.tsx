import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginUser } from '../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      showLoading();
      await loginUser(email, password);
    } catch {
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
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* 🧠 Lado izquierdo - Imagen */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage:
            'url(https://esuzvx7ndfp.exactdn.com/wp-content/uploads/2016/06/idea-foco.jpg?strip=all&lossy=1&ssl=1)',
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

      {/* 🔐 Lado derecho - Login */}
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
                Te damos la bienvenida a Crowd-Brainstorm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Iniciá sesión y disfrutá la experiencia
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={!email || !password}
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Iniciar sesión
              </Button>

              <Button
                variant="text"
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none' }}
              >
                Crear cuenta
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
