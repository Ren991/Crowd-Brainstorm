import { useState } from "react";
import {
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import { updateSessionPhase } from "../../services/sessionService";
import { createNewWorkflow } from "@/services/workflowService";
import Swal from "sweetalert2";

type Phase = "IDEAS" | "VOTING" | "RESULTS";

type Props = {
  sessionId: string;
  currentPhase: Phase;
  participantsCount: number;
};


export const SessionControls = ({ sessionId, currentPhase, participantsCount }: Props) => {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(5);
const canStartIdeas = participantsCount >= 3;

  const startIdeasPhase = async () => {
    await updateSessionPhase(sessionId, "IDEAS", minutes * 60);
    setOpen(false);
  };

  /* const handleCreateNewDashboard = async () => {
  await createNewWorkflow(sessionId, "Nuevo Brainstorm");
}; */
const handleNewDashboard = async () => {
  const { value: title } = await Swal.fire({
    title: "Nuevo dashboard",
    input: "text",
    inputLabel: "Título del dashboard",
    inputPlaceholder: "Ej: Qué mejorar",
    showCancelButton: true,
  });

  if (!title) return;

  await createNewWorkflow(sessionId, title);
};

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip label={`Fase: ${currentPhase}`} />
        {participantsCount < 3 && (
          <Chip
            color="warning"
            label="Se requieren al menos 3 participantes"
            size="small"
          />
        )}
        <Button
          size="small"
          variant="contained"
          disabled={!canStartIdeas || currentPhase === "IDEAS" || currentPhase === "VOTING" || currentPhase === "RESULTS"}
          onClick={() => setOpen(true)}
        >
          Envío de ideas
        </Button>

        <Button
          size="small"
          disabled={currentPhase === "VOTING" || currentPhase === "RESULTS"}
          onClick={() => updateSessionPhase(sessionId, "VOTING", 180)}
        >
          Votación
        </Button>

        <Button
          size="small"
          disabled={currentPhase === "RESULTS"}
          onClick={() => updateSessionPhase(sessionId, "RESULTS")}
        >
          Resultados
        </Button>

        {currentPhase === "RESULTS" && (
          <Button
            variant="contained"
            color="success"
            onClick={handleNewDashboard}
          >
            ➕ Agregar nuevo dashboard
          </Button>
        )}

      </Stack>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Duración del envío de ideas</DialogTitle>

        <DialogContent>
          <ToggleButtonGroup
            value={minutes}
            exclusive
            onChange={(_, v) => v && setMinutes(v)}
            sx={{ mt: 2 }}
          >
            <ToggleButton value={3}>3 min</ToggleButton>
            <ToggleButton value={5}>5 min</ToggleButton>
            <ToggleButton value={7}>7 min</ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={startIdeasPhase}>
            Iniciar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
