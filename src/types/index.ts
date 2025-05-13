// Definindo os tipos usados pelo contexto de autenticação

export interface User {
  email: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  loginWithRedirect: () => void;
  logout: () => void;
}


// Re-exportar outros tipos
export * from './Note';
export * from './Tool';
