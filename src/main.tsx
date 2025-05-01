// src/main.tsx

// Importa o React e o ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';
const rootElement = document.getElementById('root');

// Componente principal da aplicação
import App from './App.tsx';

// Estilos globais (Tailwind, fontes, etc.)
import './index.css';

if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado no DOM.");
}
// Ponto de entrada: conecta o React ao HTML (index.html)
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
