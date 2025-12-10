import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack
} from '@mui/material';
/*import { listenIdeas, createIdea, deleteIdea, updateIdea } from '@/services/ideasService';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useAuth } from '@/context/AuthContext';*/
import { listenIdeas, createIdea, deleteIdea, updateIdea } from '../../services/ideasService';
import { RichTextEditor } from '../../components/RichTextEditor';
import { useAuth } from '@/context/AuthContext';

export const IdeasBoard = ({ sessionId }: { sessionId: string }) => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    return listenIdeas(sessionId, setIdeas);
  }, [sessionId]);

  const handleSave = async () => {
    if (!text.trim() || !user) return;

    if (editingId) {
      await updateIdea(sessionId, editingId, text);
      setEditingId(null);
    } else {
      await createIdea(sessionId, text, user.uid, user.email || 'Anónimo', false);
    }

    setText('');
  };

  const handleEdit = (idea: any) => {
    setEditingId(idea.id);
    setText(idea.text);
  };

  return (
    <Box mt={5}>
      <Typography variant="h5" mb={2} textAlign="center">
        💡 Ideas en vivo
      </Typography>

      <RichTextEditor value={text} onChange={setText} />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSave}
      >
        {editingId ? 'Actualizar idea' : 'Publicar idea'}
      </Button>

      <Stack spacing={2} mt={4}>
        {ideas.map((idea) => (
          <Card key={idea.id} sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography
                dangerouslySetInnerHTML={{ __html: idea.text }}
              />

              <Typography variant="caption" color="text.secondary">
                {idea.isAnonymous ? 'Anónimo' : idea.authorName}
              </Typography>

              {idea.createdBy === user?.uid && (
                <Box mt={2} display="flex" gap={2}>
                  <Button size="small" onClick={() => handleEdit(idea)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => deleteIdea(sessionId, idea.id)}>Eliminar</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
