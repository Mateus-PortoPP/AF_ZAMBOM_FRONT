export interface Tool {
  id: string;
  titulo: string;         // Título do feedback
  descricao: string;      // Descrição do feedback
  nota: number;           // Nota do feedback (0-10)
  nomeUsuario?: string;   // Nome do usuário que criou o feedback
  emailUsuario?: string;  // Email do usuário que criou o feedback
  
  // Frontend-only properties (will be mapped in service layer)
  title?: string;         // Alias para titulo para compatibilidade com componentes
  description?: string;   // Alias para descricao para compatibilidade com componentes
  rating?: number;        // Alias para nota para compatibilidade com componentes
}
