import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box flex={1} p={2}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
