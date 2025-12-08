import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './auth/pages/LoginPage';
import { RegisterPage } from './auth/pages/RegisterPage';
import {Dashboard} from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import {LoadingProvider} from './context/LoadingContext';
import { BusyDialog } from './components/BusyDialog';
import { MainLayout } from './components/layout/MainLayout';
import { SessionPage } from './pages/sessions/SessionPage';

function App() {
  return (
    <LoadingProvider>
    <AuthProvider>
      <BrowserRouter>
      <BusyDialog />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:id"
            element={
              <ProtectedRoute>
                <SessionPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
        </LoadingProvider>

  );
}

export default App;
