import { useState } from 'react';
import { Box, TextField, Button, Typography, Modal, Stack } from '@mui/material';
import { createSession } from '../../services/sessionService';
import { useAuth } from '@/context/AuthContext';
import { useLoading } from '@/context/LoadingContext';
import Swal from 'sweetalert2';

export const CreateSessionModal = ({ open, onClose, onCreated }: any) => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [title, setTitle] = useState('');
  // preferir displayName del perfil, si no usar email como fallback
  const [displayName, setDisplayName] = useState(user?.displayName || user?.email || '');

  /* onst handleCreate = async () => {
    if (!title.trim() || !displayName.trim()) {
      return Swal.fire('Error', 'El título y tu nombre son obligatorios', 'error');
    }

    try {
      showLoading();
      const { id, code } = await createSession({
        title: title.trim(),
        description: '',
        createdBy: user!.uid,
        createdByEmail: user!.email,
        displayName: displayName.trim(),
        isAnonymous: false,
        maxParticipants: 50
      });
      Swal.fire('¡Sesión creada!', `Código: ${code}`, 'success');
      onCreated(id, code);
      setTitle('');
    } catch (err: any) {
      Swal.fire('Error', err.message || 'No se pudo crear la sesión', 'error');
    } finally {
      hideLoading();
    }
  }; */
  
const handleCreate = async () => {
  if (!user) {
    Swal.fire('Error', 'Debes estar autenticado para crear una sesión', 'error');
    return;
  }

  if (!title.trim() || !displayName.trim()) {
    return Swal.fire(
      'Error',
      'El título y tu nombre son obligatorios',
      'error'
    );
  }

  try {
    showLoading();

    const { id, code } = await createSession({
      title: title.trim(),
      description: '',
      createdBy: user.uid,          // ✅ seguro
      createdByEmail: user.email || '',
      displayName: displayName.trim(),
      isAnonymous: false,
      maxParticipants: 50
    });

    Swal.fire('¡Sesión creada!', `Código: ${code}`, 'success');
    onCreated(id, code);
    setTitle('');
  } catch (err: any) {
    console.log(err)
    Swal.fire('Error', err.message || 'No se pudo crear la sesión', 'error');
  } finally {
    hideLoading();
  }
};

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 10, bgcolor: 'background.paper', p: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2} textAlign="center">Crear nueva sesión</Typography>
        <Stack spacing={2}>
          <TextField label="Título de la sesión" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField label="Tu nombre" value={displayName} onChange={(e) => setDisplayName(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleCreate} fullWidth>Crear sesión</Button>
        </Stack>
      </Box>
    </Modal>
  );
};
