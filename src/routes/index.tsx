// src/routes/index.tsx
import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { ToastContainerProps } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { AuthProvider } from "../contexts/AuthContext";

// Layouts
import AppLayout from "../layout/AppLayout";

// Pages
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import TransactionForm from "../pages/TransactionForm";
import Transactions from "../pages/Transactions";

// Routes
import PrivateRoute from "./PrivateRoute";

/**
 * Configuração principal das rotas da aplicação
 */
const AppRoutes: FC = () => {
  // Configurações do toast
  const toastConfig: ToastContainerProps = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<TransactionForm />} />
            </Route>
          </Route>

          {/* Rota 404 */}
          <Route
            path="*"
            element={<h1 className="text-center text-white">Página não encontrada</h1>}
          />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer {...toastConfig} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
