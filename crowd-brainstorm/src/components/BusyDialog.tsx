import { Dialog, CircularProgress, Box } from '@mui/material';
import { useLoading } from '../context/LoadingContext';

export const BusyDialog = () => {
  const { loading } = useLoading();

  return (
    <Dialog 
      open={loading}
      PaperProps={{
        sx: { 
          p: 4, 
          background: 'transparent', 
          boxShadow: 'none' 
        }
      }}
    >
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
      >
        <CircularProgress size={60} />
      </Box>
    </Dialog>
  );
};
