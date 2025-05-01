import { BrowserRouter, Route, Routes as RouterSwitch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { AuthProvider } from "../contexts/AuthContext";

// Layouts
import AppLayout from "../layout/AppLayout";

import Dashboard from "../pages/Dashboard";
// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import TransactionForm from "../pages/TransactionForm";
import Transactions from "../pages/Transactions";

// Routes
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<RouterSwitch>
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
						element={
							<h1 className="text-center text-white">Página não encontrada</h1>
						}
					/>
				</RouterSwitch>

				{/* Toast notifications */}
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
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
