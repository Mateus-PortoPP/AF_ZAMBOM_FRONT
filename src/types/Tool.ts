export interface Tool {
  id: string;
  nome: string;           // Changed from name to nome to match backend
  descricao: string;      // Changed from description to descricao
  categoria: string;      // Changed from category to categoria
  nomeUsuario?: string;   // Added to match backend
  emailUsuario?: string;  // Added to match backend
  
  // Frontend-only properties (will be mapped in service layer)
  name?: string;          // Keep for compatibility with existing components
  description?: string;   // Keep for compatibility with existing components
  category?: string;      // Keep for compatibility with existing components
  price?: number;         // Optional as it's not in backend
  brand?: string;         // Optional as it's not in backend
  available?: boolean;    // Optional as it's not in backend
  imageUrl?: string;      // Optional as it's not in backend
}
