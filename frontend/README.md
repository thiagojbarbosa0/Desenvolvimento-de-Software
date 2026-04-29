Frontend - Aplicação React + Vite

COMO RODAR O PROJETO

Pré-requisitos:
Node.js v18 ou superior
npm ou yarn

Instalação:
cd frontend
npm install

Rodar em desenvolvimento:
npm run dev
Acesse: http://localhost:5173

Build para produção:
npm run build
npm run preview

ESTRUTURA DAS TELAS

Rota / - Arquivo: src/pages/TelaInicial.jsx - Descrição: Home / Landing Page
Rota /login - Arquivo: src/pages/TelaLogin.jsx - Descrição: Tela de Login  
Rota /dashboard - Arquivo: src/pages/TelaPrincipal.jsx - Descrição: Dashboard + Chatbot

CONEXÃO COM BACKEND

A URL base da API está em src/services/api.js:

const api = axios.create({
  baseURL: 'http://localhost:8000' // MOCK - trocar quando back subir
});

Status atual: Usando dados mockados. Aguardando rotas do backend para integração real.

TECNOLOGIAS
React 18
Vite
Axios
React Router

BRANCH
Este código está na branch feature/integracao-login
