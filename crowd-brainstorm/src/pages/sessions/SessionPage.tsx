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
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

export const SessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();

  const [session, setSession] = useState<any>(null);
  const [workflow, setWorkflow] = useState<any>(null);

  // 🔹 Timer global
  const { remainingSeconds } = useSessionTimer(session);

  // 🔄 Escuchar sesión
  useEffect(() => {
    if (!id) return;

    showLoading();

    const unsub = listenSessionById(id, (s) => {
      setSession(s);
      hideLoading();
    });

    return () => unsub();
  }, [id]);

  // 🔄 Escuchar workflow activo
 /*  useEffect(() => {
    if (!session?.activeWorkflowId) return;

    const ref = doc(
      db,
      "sessions",
      session.id,
      "workflows",
      session.activeWorkflowId
    );

    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      setWorkflow({ id: snap.id, ...snap.data() });
    });
  }, [session?.activeWorkflowId]); */
  useEffect(() => {
    console.log("useEffect workflow activo",session)
  if (!session?.id || !session?.activeWorkflowId) return;

  const ref = doc(
    db,
    "sessions",
    session.id,
    "workflows",
    session.activeWorkflowId
  );
console.log(ref)
  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    setWorkflow({ id: snap.id, ...snap.data() });
  });

  return () => unsub();
}, [session?.id, session?.activeWorkflowId]);


  // 🔴 Eliminar sesión
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

    showLoading();

    try {
      await deleteSessionById(id!);
      hideLoading();

      await Swal.fire(
        "Eliminada",
        "La sesión fue eliminada correctamente",
        "success"
      );

      navigate("/dashboard");
    } catch {
      hideLoading();
      Swal.fire("Error", "No se pudo eliminar la sesión", "error");
    }
  };

  // ⏳ Loading
  if (!session || !workflow) {
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
      <SessionHeader
        timeLeft={remainingSeconds}
        isCreator={isCreator}
        onBack={() => navigate("/dashboard")}
        onDelete={handleDeleteSession}
        currentPhase={session.phase}
      />

      {isCreator && (
        <SessionControls
          sessionId={id!}
          currentPhase={session.phase}
          participantsCount={session.participantsCount}
        />
      )}

      <Box sx={{ flex: 1, minHeight: 0, mt: 2 }}>
        <IdeasBoard
          sessionId={id!}
          workflowId={workflow.id}
          currentPhase={session.phase}
        />
      </Box>
    </Container>
  );
};
