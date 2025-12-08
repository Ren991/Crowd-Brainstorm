import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { getSessionByCode, joinSessionById } from '../../services/sessionService';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';
import { useLoading } from '@/context/LoadingContext';
import { useNavigate } from 'react-router-dom';

export const JoinSessionPage = () => {
  const [code, setCode] = useState('');
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      showLoading();
      const session = await getSessionByCode(code.trim().toUpperCase());
      if (!session) {
        Swal.fire('No encontrada', 'Código inválido', 'error');
        return;
      }

      const res = await joinSessionById(session.id, user!.uid, user!.email || undefined);
      Swal.fire('¡Listo!', 'Te uniste a la sesión', 'success');
      navigate(`/session/${session.id}`);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'No pudiste unirte', 'error');
    } finally {
      hideLoading();
    }
  };

  return (
    <Box>
      <Typography variant="h5">Unirse por código</Typography>
      <TextField label="Código" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="contained" onClick={handleJoin}>Unirse</Button>
    </Box>
  );
};
