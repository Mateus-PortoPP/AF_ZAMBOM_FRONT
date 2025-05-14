import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthContextType, User } from '../types';
import { setAuthToken } from '../services/api';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    getAccessTokenSilently,
    loginWithRedirect, 
    logout 
  } = useAuth0();
  const [token, setToken] = useState<string | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && user) {
        try {          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          // Set the token for API calls
          setAuthToken(accessToken);
            // Criar um objeto de usuário para nossa aplicação
          // Considerando administradores por email por enquanto
          // Em uma implementação real, isso seria baseado em roles do Auth0 ou verificação com backend
          const isAdmin = user.email?.includes('admin') || false;
          console.log('User authenticated:', { email: user.email, isAdmin });
          
          setAppUser({
            email: user.email || '',
            isAdmin
          });
        } catch (error) {
          console.error('Erro ao obter token:', error);
        }
      } else {
        // Clear the token if not authenticated
        setAuthToken(null);
      }
    };

    getToken();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const value = {
    isAuthenticated,
    isLoading,
    user: appUser,
    token,
    loginWithRedirect,
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};