# Zambom Frontend - Requisitos do Projeto

## 1. Requisitos Funcionais

### 1.1 Autenticação e Autorização
- RF001: O sistema deve permitir que usuários façam login utilizando o serviço Auth0
- RF002: O sistema deve implementar controle de acesso baseado em funções (admin/usuário comum)
- RF003: O sistema deve manter o usuário logado entre sessões quando solicitado
- RF004: O sistema deve garantir que apenas usuários autenticados possam acessar áreas protegidas

### 1.2 Gerenciamento de Notas
- RF005: O sistema deve permitir que usuários criem novas notas com título, conteúdo e categoria
- RF006: O sistema deve permitir que usuários visualizem suas notas existentes
- RF007: O sistema deve permitir que usuários editem notas existentes
- RF008: O sistema deve permitir que usuários excluam notas existentes
- RF009: O sistema deve permitir que usuários filtrem notas por categoria
- RF010: O sistema deve permitir que usuários pesquisem notas por texto contido no título ou conteúdo

### 1.3 Gerenciamento de Ferramentas
- RF011: O sistema deve permitir que administradores criem novas ferramentas
- RF012: O sistema deve permitir que usuários visualizem ferramentas disponíveis
- RF013: O sistema deve permitir que administradores editem ferramentas existentes
- RF014: O sistema deve permitir que administradores excluam ferramentas existentes
- RF015: O sistema deve permitir que usuários filtrem ferramentas por categoria
- RF016: O sistema deve permitir que usuários pesquisem ferramentas por nome ou descrição

## 2. Requisitos Não Funcionais

### 2.1 Usabilidade
- RNF001: A interface do usuário deve ser responsiva e funcionar em dispositivos móveis e desktop
- RNF002: O sistema deve fornecer feedback visual para ações do usuário 
- RNF003: A aplicação deve ter um tempo de carregamento inicial inferior a 3 segundos em conexões padrão

### 2.2 Performance
- RNF004: As operações de CRUD devem ser concluídas em menos de 1 segundo
- RNF005: A aplicação deve suportar pelo menos 100 usuários simultâneos
- RNF006: O tempo de resposta para as pesquisas não deve exceder 2 segundos

### 2.3 Segurança
- RNF007: Todos os dados sensíveis devem ser transmitidos usando HTTPS
- RNF008: Os tokens de autenticação devem ser armazenados de forma segura
- RNF009: O sistema deve implementar proteção contra ataques CSRF e XSS

### 2.4 Manutenibilidade
- RNF010: O código deve seguir os padrões de codificação React e TypeScript
- RNF011: O código deve incluir comentários explicativos para partes complexas
- RNF012: A aplicação deve ser modular e seguir princípios de design de componentes reutilizáveis

## 3. Requisitos Técnicos

### 3.1 Tecnologias Obrigatórias
- RT001: React 18 ou superior para a construção da interface
- RT002: TypeScript para desenvolvimento com tipagem estática
- RT003: Vite como ferramenta de build e desenvolvimento
- RT004: Tailwind CSS para estilização
- RT005: Auth0 para gerenciamento de autenticação
- RT006: Axios para comunicação com APIs

### 3.2 Integração
- RT007: A aplicação deve se integrar com a API RESTful em http://18.230.226.30:8080/api/ferramentas
- RT008: A aplicação deve utilizar tokens JWT para autenticação com a API
- RT009: A aplicação deve lidar adequadamente com erros de API e problemas de conectividade

### 3.3 Compatibilidade
- RT010: A aplicação deve ser compatível com as últimas versões dos navegadores Chrome, Firefox, Safari e Edge
- RT011: A aplicação deve funcionar em sistemas operacionais Windows, macOS e Linux

## 4. Requisitos de Implantação
- RD001: A aplicação deve ser implantável em qualquer servidor web estático
- RD002: A build de produção deve ser otimizada para tamanho e performance
- RD003: Variáveis de ambiente devem ser configuráveis para diferentes ambientes (dev, staging, prod)
