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

type Phase = "IDEAS" | "VOTING" | "RESULTS";

type Props = {
  sessionId: string;
  currentPhase: Phase;
};

export const SessionControls = ({ sessionId, currentPhase }: Props) => {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(5);

  const startIdeasPhase = async () => {
    await updateSessionPhase(sessionId, "IDEAS", minutes * 60);
    setOpen(false);
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip label={`Fase: ${currentPhase}`} />

        <Button
          size="small"
          variant="contained"
          disabled={currentPhase === "IDEAS"}
          onClick={() => setOpen(true)}
        >
          Envío de ideas
        </Button>

        <Button
          size="small"
          disabled={currentPhase === "VOTING"}
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
