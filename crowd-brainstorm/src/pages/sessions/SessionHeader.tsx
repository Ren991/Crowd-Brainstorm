import { Box, Typography, Button, Stack, Chip } from "@mui/material";

type Props = {
  timeLeft: number;               // 👈 AGREGAR
  isCreator: boolean;
  onBack: () => void;
  onDelete: () => void | Promise<void>;
};

export const SessionHeader = ({
  timeLeft,
  isCreator,
  onBack,
  onDelete,
}: Props) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      {/* ⏱️ Cronómetro */}
    {/*   <Chip
        label={`⏱️ ${minutes}:${seconds.toString().padStart(2, "0")}`}
        color={timeLeft <= 10 ? "error" : "primary"}
      /> */}
      <Chip
        color={timeLeft <= 10 ? "error" : "primary"}
        label={`⏱️ ${minutes}:${seconds.toString().padStart(2, "0")}`}
      />

      {/* Acciones */}
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={onBack}>
          Volver
        </Button>

        {isCreator && (
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={onDelete}
          >
            Eliminar sesión
          </Button>
        )}
      </Stack>
    </Box>
  );
};
