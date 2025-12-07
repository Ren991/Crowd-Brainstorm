import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Crowd Brainstorm
      </Typography>
    </Box>
  );
};
