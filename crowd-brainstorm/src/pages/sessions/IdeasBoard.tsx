import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { db } from '../../app/firebase';
import { useAuth } from '../../context/AuthContext';

interface Props {
  sessionId: string;
}

const COLORS = ['#fff9c4', '#c8e6c9', '#bbdefb', '#ffe0b2', '#f8bbd0'];

export const IdeasBoard = ({ sessionId }: Props) => {
  const { user } = useAuth();

  const [ideas, setIdeas] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const authorName = user?.displayName || user?.email || 'Anónimo';

  // 🔌 Firestore realtime
  useEffect(() => {
    const q = query(
      collection(db, 'sessions', sessionId, 'ideas'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeas(list);
    });

    return () => unsubscribe();
  }, [sessionId]);

  // ➕ Crear idea
  const addIdea = async () => {
    if (!text.trim()) return;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    await addDoc(collection(db, 'sessions', sessionId, 'ideas'), {
      text,
      author: authorName,
      uid: user?.uid,
      color,
      createdAt: serverTimestamp()
    });

    setText('');
  };

  // ✏️ Editar
  const startEdit = (idea: any) => {
    setEditingId(idea.id);
    setEditText(idea.text);
  };

  const saveEdit = async (id: string) => {
    const ref = doc(db, 'sessions', sessionId, 'ideas', id);
    await updateDoc(ref, { text: editText });
    setEditingId(null);
    setEditText('');
  };

  // 🗑️ Eliminar
  const removeIdea = async (id: string) => {
    const ref = doc(db, 'sessions', sessionId, 'ideas', id);
    await deleteDoc(ref);
  };

  return (
    <Box
      mt={4}
      mb={4}
      p={3}
      sx={{
        background: '#deb887',
        borderRadius: 4,
        minHeight: '70vh',
        backgroundImage:
          'radial-gradient(#caa472 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        🧠 Muro de Ideas
      </Typography>

      {/* 📝 Formulario */}
      <Box
        display="flex"
        gap={2}
        mb={4}
        sx={{ maxWidth: 600, mx: 'auto' }}
      >
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Escribí una idea brillante..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addIdea}
          sx={{ minWidth: 120 }}
        >
          Publicar
        </Button>
      </Box>

      {/* 🧩 Post-its */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="center"
      >
        {ideas.map((idea) => (
          <Paper
            key={idea.id}
            elevation={4}
            sx={{
              width: 220,
              minHeight: 160,
              p: 2,
              borderRadius: 3,
              position: 'relative',
              background: idea.color || '#fff9c4',
              transform: 'rotate(-1deg)',
              transition: '0.2s ease',
              '&:hover': {
                transform: 'rotate(0deg) scale(1.03)'
              }
            }}
          >
            {/* ✏️ Acciones */}
            {idea.uid === user?.uid && (
              <Box
                position="absolute"
                top={6}
                right={6}
                display="flex"
                gap={0.5}
              >
                <Button
                  size="small"
                  onClick={() => startEdit(idea)}
                >
                  ✏️
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeIdea(idea.id)}
                >
                  🗑️
                </Button>
              </Box>
            )}

            {/* ✍️ Contenido */}
            {editingId === idea.id ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  size="small"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => saveEdit(idea.id)}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {idea.text}
              </Typography>
            )}

            {/* 👤 Autor */}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 12,
                fontStyle: 'italic',
                opacity: 0.7
              }}
            >
              — {idea.author || 'Anónimo'}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
