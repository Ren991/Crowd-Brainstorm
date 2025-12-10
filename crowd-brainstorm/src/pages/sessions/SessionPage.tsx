import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSessionById } from '../../services/sessionService';
import { Typography, Container, Box, Card, CardContent, Button, List, ListItemText, ListItem, Divider } from '@mui/material';
import { useLoading } from '../../context/LoadingContext';
import { IdeasBoard } from './IdeasBoard';

export const SessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
  if (!id) return;

  const loadSession = async () => {
    try {
      showLoading();
      const s = await getSessionById(id);
      setSession(s);
    } finally {
      hideLoading();
    }
  };

  loadSession();
}, [id]);

  if (!session) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Cargando sesión...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card elevation={6}>
        <CardContent>
          <Typography variant="h3" gutterBottom>{session.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {session.description || 'Sin descripción'}
          </Typography>

          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" mt={3}>Participantes ({session.participantsCount})</Typography>
<List>
  {Object.entries(session.participants || {}).map(([uid, p]: any) => (
    <Box key={uid}>
      <ListItem>
        <ListItemText primary={p.displayName || 'Anónimo'} secondary={`Se unió: ${p.joinedAt?.toDate().toLocaleString()}`} />
      </ListItem>
      <Divider />
    </Box>
  ))}
</List>
<Box mt={4}>
  <IdeasBoard sessionId={id!} />
</Box>
    </Container>
  );
};
