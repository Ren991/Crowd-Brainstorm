import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import  { type ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Cargando...</p>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
