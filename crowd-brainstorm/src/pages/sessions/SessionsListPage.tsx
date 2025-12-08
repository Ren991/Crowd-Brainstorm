import { useEffect, useState } from 'react';
import { Button, Box, Typography, Card, CardContent, Grid } from '@mui/material';

import { listSessionsByUser, getSessionByCode } from '../../services/sessionService';
import { useAuth } from '@/context/AuthContext';
import { CreateSessionModal } from './CreateSessionModal';
import { useNavigate } from 'react-router-dom';

export const SessionsListPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const unsub = listSessionsByUser(user.uid, (arr) => setSessions(arr));
    return () => unsub && unsub();
  }, [user]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Mis sesiones</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Crear sesión</Button>
      </Box>

      <Grid container spacing={2}>
        {sessions.map(s => (
          <Grid key={s.id} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">{s.description}</Typography>
                <Box mt={2} display="flex" gap={2}>
                  <Button onClick={() => navigate(`/session/${s.id}`)}>Abrir</Button>
                  <Button onClick={() => navigator.clipboard.writeText(s.code)}>Copiar código</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreateSessionModal open={open} onClose={() => setOpen(false)} onCreated={(id:string, code:string) => navigate(`/session/${id}`)} />
    </Box>
  );
};
