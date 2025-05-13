import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Notes Manager</h1>
          <p className="text-gray-600">Faça login para gerenciar suas anotações</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => loginWithRedirect()}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors"
          >
            <LogIn size={20} />
            <span>Entrar com Auth0</span>
          </button>

          <div className="text-sm text-center text-gray-500 mt-4">
            Ao fazer login, você concorda com nossos termos de serviço e política de privacidade.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
