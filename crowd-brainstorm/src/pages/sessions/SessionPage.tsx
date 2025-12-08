import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSessionById } from '../../services/sessionService';
import { Typography, Container, Box, Card, CardContent, Button } from '@mui/material';
import { useLoading } from '../../context/LoadingContext';

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
    </Container>
  );
};
