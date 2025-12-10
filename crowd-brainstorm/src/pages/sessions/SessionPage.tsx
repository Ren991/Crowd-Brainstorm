import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSessionById } from "../../services/sessionService";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { useLoading } from "../../context/LoadingContext";
import { IdeasBoard } from "./IdeasBoard";
import { deleteSessionById } from "../../services/sessionService";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

export const SessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [session, setSession] = useState<any>(null);
  const { user } = useAuth();

  const handleDeleteSession = async () => {
    const result = await Swal.fire({
      title: "¿Eliminar sesión?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      showLoading();
      await deleteSessionById(id!);

      Swal.fire("Eliminada", "La sesión fue eliminada", "success");
      navigate("/dashboard");
    } catch (e) {
      Swal.fire("Error", "No se pudo eliminar la sesión", "error");
    } finally {
      hideLoading();
    }
  };

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

  if (!session) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center" }}>
        Cargando sesión...
      </Typography>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        pt: 2,
      }}
    >
      {/* Header compacto */}
      <Card sx={{ mb: 2 }}>
        <CardContent
          sx={{
            py: 1.5,
            "&:last-child": { pb: 1.5 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {/* Título pequeño */}
            <Box>
              <Typography variant="h6">{session.title}</Typography>
              {session.description && (
                <Typography variant="caption" color="text.secondary">
                  {session.description}
                </Typography>
              )}
            </Box>

            {/* Participantes + botón */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={`${session.participantsCount} participantes`}
                variant="outlined"
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/dashboard")}
              >
                Volver
              </Button>

              {user?.uid === session.createdBy && (
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={handleDeleteSession}
                >
                  Eliminar sesión
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* IdeasBoard - ocupa todo el resto */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <IdeasBoard sessionId={id!} />
      </Box>
    </Container>
  );
};
