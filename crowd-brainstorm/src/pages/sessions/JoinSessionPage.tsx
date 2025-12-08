import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack
} from '@mui/material';

import { getSessionByCode, joinSessionById } from '../../services/sessionService';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';
import { useLoading } from '@/context/LoadingContext';
import { useNavigate } from 'react-router-dom';

export const JoinSessionPage = () => {
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!code.trim()) {
      return Swal.fire('Error', 'Debes ingresar un código', 'error');
    }

    if (!displayName.trim()) {
      return Swal.fire('Error', 'Debes ingresar tu nombre', 'error');
    }

    try {
      showLoading();

      const session = await getSessionByCode(code.trim().toUpperCase());

      if (!session) {
        return Swal.fire('No encontrada', 'Código inválido', 'error');
      }

      await joinSessionById(
        session.id,
        user!.uid,
        displayName.trim()
      );

      Swal.fire('¡Listo!', 'Te uniste a la sesión', 'success');
      navigate(`/session/${session.id}`);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'No pudiste unirte', 'error');
    } finally {
      hideLoading();
    }
  };

  return (
    <Card
      sx={{
        mt: 4,
        p: 2,
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        maxWidth: 500,
        mx: 'auto',
        background: 'linear-gradient(135deg, #ffffff, #f8fafc)'
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={700}
        >
          Unirse a una sesión 🚀
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Ingresá el código de la sesión y tu nombre para participar.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Código de sesión"
            placeholder="Ej: ME35-QEB"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />

          <TextField
            label="Tu nombre"
            placeholder="Ej: Renzo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleJoin}
            sx={{
              py: 1.3,
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            }}
          >
            Entrar a la sesión
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
