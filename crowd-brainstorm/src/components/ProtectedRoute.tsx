import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  // 🔄 Esperar a Firebase
  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  // 🔒 No logueado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logueado
  return children;
};
