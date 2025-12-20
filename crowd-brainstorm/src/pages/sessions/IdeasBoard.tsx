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
  deleteDoc,
  increment,
  deleteField
} from 'firebase/firestore';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { db } from '../../app/firebase';
import { useAuth } from '../../context/AuthContext';

type Props = {
  sessionId: string;
  currentPhase: "IDEAS" | "VOTING" | "RESULTS";
}

const COLORS = [
  '#fff9c4',
  '#c8e6c9',
  '#bbdefb',
  '#ffe0b2',
  '#f8bbd0'
];

export const IdeasBoard = ({ sessionId, currentPhase }: Props) => {
  const { user } = useAuth();

  const [ideas, setIdeas] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const canWrite = currentPhase === "IDEAS";
const canVote = currentPhase === "VOTING";
const isResults = currentPhase === "RESULTS";


  const authorName = user?.displayName || user?.email || 'Anónimo';

  /* ================================
     REALTIME IDEAS (ordenadas por votos)
  ================================= */
  useEffect(() => {
    const q = query(
      collection(db, 'sessions', sessionId, 'ideas'),
      orderBy('votesCount', 'desc'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeas(list);
    });

    return () => unsub();
  }, [sessionId]);

  /* ================================
     CREAR IDEA
  ================================= */
  const addIdea = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, 'sessions', sessionId, 'ideas'), {
      text,
      author: authorName,
      uid: user?.uid,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      votesCount: 0,
      votes: {},
      createdAt: serverTimestamp()
    });

    setText('');
  };

  /* ================================
     EDITAR
  ================================= */
  const startEdit = (idea: any) => {
    setEditingId(idea.id);
    setEditText(idea.text);
  };

  const saveEdit = async (id: string) => {
    await updateDoc(
      doc(db, 'sessions', sessionId, 'ideas', id),
      { text: editText }
    );
    setEditingId(null);
    setEditText('');
  };

  /* ================================
     ELIMINAR
  ================================= */
  const removeIdea = async (id: string) => {
    await deleteDoc(
      doc(db, 'sessions', sessionId, 'ideas', id)
    );
  };

  /* ================================
     VOTAR / DESVOTAR
  ================================= */
  const toggleVote = async (idea: any) => {
    if (!user) return;

    const ref = doc(db, 'sessions', sessionId, 'ideas', idea.id);
    const hasVoted = !!idea.votes?.[user.uid];

    await updateDoc(ref, {
      [`votes.${user.uid}`]: hasVoted ? deleteField() : true,
      votesCount: increment(hasVoted ? -1 : 1)
    });
  };

  /* ================================
     UI
  ================================= */
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        p: 4,
        background: '#deb887',
        backgroundImage:
          'radial-gradient(#caa472 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        🧠 Muro de Ideas
      </Typography>

      {/* Formulario */}
      <Box display="flex" gap={2} mb={4} maxWidth={600} mx="auto">
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Escribí una idea..."
          value={text}
          disabled={!canWrite}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={addIdea} disabled={!canWrite}>
          Publicar
        </Button>
      </Box>

      {/* Post-its */}
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {ideas.map((idea) => {
          const hasVoted = !!idea.votes?.[user?.uid || ''];

          return (
            <Paper
              key={idea.id}
              elevation={4}
              sx={{
                width: 220,
                minHeight: 170,
                p: 2,
                borderRadius: 3,
                background: idea.color,
                position: 'relative',
                transform: 'rotate(-1deg)'
              }}
            >
              {/* Edit / Delete */}
              {idea.uid === user?.uid && (
                <Box position="absolute" top={6} right={6} display="flex">
                  <Button size="small" onClick={() => startEdit(idea)}  disabled={!canWrite}>✏️</Button>
                  <Button size="small" color="error" onClick={() => removeIdea(idea.id)}  disabled={!canWrite}>🗑️</Button>
                </Box>
              )}

              {/* Texto */}
              {editingId === idea.id ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <Button size="small" onClick={() => saveEdit(idea.id)}>
                    Guardar
                  </Button>
                </>
              ) : (
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {idea.text}
                </Typography>
              )}

              {/* Votos */}
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                position="absolute"
                bottom={8}
                left={8}
              >
                <IconButton
                  size="small"
                  onClick={() => toggleVote(idea)}
                  color={hasVoted ? 'primary' : 'default'}
                  disabled={!canVote}
                >
                  {hasVoted ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                </IconButton>
                <Typography fontWeight="bold">
                  {idea.votesCount || 0}
                </Typography>
              </Box>

              {/* Autor */}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 12,
                  opacity: 0.7,
                  fontStyle: 'italic'
                }}
              >
                — {idea.author}
              </Typography>
            </Paper>
          );
        })}
      </Box>
      {isResults && ideas.length > 0 && (
  <Box mb={4} textAlign="center">
    <Typography variant="h5" mb={2}>
      🏆 Top Ideas
    </Typography>

    {ideas.slice(0, 3).map((idea, i) => (
      <Typography key={idea.id} fontSize={18}>
        {i === 0 && "🥇"}
        {i === 1 && "🥈"}
        {i === 2 && "🥉"}
        {" "}
        {idea.text} — <b>{idea.votesCount}</b> votos
      </Typography>
    ))}
  </Box>
)}
    </Box>
  );
};
