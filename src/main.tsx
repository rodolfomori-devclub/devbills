// src/main.tsx

// Importa o React e o ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Componente principal da aplicação
import App from './App.tsx';

// Estilos globais (Tailwind, fontes, etc.)
import './index.css';

// Ponto de entrada: conecta o React ao HTML (index.html)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
