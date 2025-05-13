
import { useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import ToolsPage from './pages/ToolsPage';
import { setAuthToken } from './services/api';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, isLoading, token } = useAuth();

  // Configurar o token de autenticação para as chamadas de API
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra a página de login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render just the tools page
  return <ToolsPage />;
}

// Remove the custom implementation and import useEffect from React

export default App;
