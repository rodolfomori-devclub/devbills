import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from '../contexts/AuthContext';

// Layouts
import AppLayout from '../layout/AppLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import TransactionForm from '../pages/TransactionForm';
import NotFound from '../pages/NotFound';

// Routes
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
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
          
          {/* Rota de fallback */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Configuração do Toast com tema adaptativo */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;