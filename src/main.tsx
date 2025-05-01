// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
const rootElement = document.getElementById("root");

import App from "./App.tsx";

import "./index.css";

if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado no DOM.");
}
// Ponto de entrada: conecta o React ao HTML (index.html)
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
