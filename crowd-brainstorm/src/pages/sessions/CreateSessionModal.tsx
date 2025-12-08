import { useState } from 'react';
import { Modal, Box, TextField, Button, Switch, FormControlLabel, Typography } from '@mui/material';
import { createSession } from  '../../services/sessionService';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';
import { useLoading } from '@/context/LoadingContext';

export const CreateSessionModal = ({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: (id: string, code: string) => void }) => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setAnonymous] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(50);

  const handleCreate = async () => {
    if (!title.trim()) {
      Swal.fire('Titulo requerido', 'Poné un título para la sesión', 'warning');
      return;
    }
    if (!user) return;

    try {
      showLoading();
      const { id, code } = await createSession({
        title,
        description,
        createdBy: user.uid,
        createdByEmail: user.email,
        isAnonymous,
        maxParticipants,
      });

      Swal.fire('Sesión creada', `Código: ${code}`, 'success');
      onCreated?.(id, code);
      onClose();
    } catch (err: any) {
      Swal.fire('Error', err.message || 'No se pudo crear la sesión', 'error');
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 520, p: 3, mx: 'auto', mt: '10vh', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">Crear nueva sesión</Typography>
        <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt:2 }} />
        <TextField fullWidth label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mt:2 }} multiline rows={3} />
        <FormControlLabel control={<Switch checked={isAnonymous} onChange={(e) => setAnonymous(e.target.checked)} />} label="Modo anónimo" />
        <TextField type="number" label="Max participantes" value={maxParticipants ?? ''} onChange={(e)=> setMaxParticipants(Number(e.target.value))} sx={{ mt:2 }} />
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate}>Crear</Button>
        </Box>
      </Box>
    </Modal>
  );
};
