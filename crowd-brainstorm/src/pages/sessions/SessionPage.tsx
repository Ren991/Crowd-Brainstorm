import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";

import { getSessionById, deleteSessionById, listenSessionById } from "../../services/sessionService";
import { useLoading } from "../../context/LoadingContext";
import { useAuth } from "../../context/AuthContext";

import { SessionHeader } from "./SessionHeader";
import { SessionControls } from "./SessionControls";
import { IdeasBoard } from "./IdeasBoard";
import { useSessionTimer } from "@/hooks/useSessionTimer";

export const SessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();

  const [session, setSession] = useState<any>(null);

  // 🔹 Timer global (todos ven el mismo)
  const { remainingSeconds } = useSessionTimer(session);

  // 🔴 Eliminar sesión (solo creador)
  const handleDeleteSession = async () => {
    const result = await Swal.fire({
      title: "¿Eliminar sesión?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      showLoading();
      await deleteSessionById(id!);

      await Swal.fire(
        "Eliminada",
        "La sesión fue eliminada correctamente",
        "success"
      );

      navigate("/dashboard");
    } catch {
      Swal.fire("Error", "No se pudo eliminar la sesión", "error");
    } finally {
      hideLoading();
    }
  };

  // 🔄 Cargar sesión
/*   useEffect(() => {
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
  }, [id]); */
  useEffect(() => {
  if (!id) return;

  showLoading();

  const unsub = listenSessionById(id, (s) => {
    setSession(s);
    hideLoading();
  });

  return () => unsub();
}, [id]);

  if (!session) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center" }}>
        Cargando sesión...
      </Typography>
    );
  }

  const isCreator = user?.uid === session.createdBy;

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
      {/* 🧠 HEADER (acá se VE el cronómetro) */}
      <SessionHeader
        timeLeft={remainingSeconds}
        isCreator={isCreator}
        onBack={() => navigate("/dashboard")}
        onDelete={handleDeleteSession}
        currentPhase={session.phase}
      />

      {/* 🎛 CONTROLES DE FASE (solo creador) */}
      {isCreator && (
        <SessionControls
          sessionId={id!}
          currentPhase={session.phase}
          participantsCount={session.participantsCount}
        />
      )}

      {/* 🧩 TABLERO DE IDEAS */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mt: 2,
        }}
      >
        <IdeasBoard
          sessionId={id!}
          currentPhase={session.phase}
        />
      </Box>
    </Container>
  );
};
