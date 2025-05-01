import { Activity, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
	const { authState, signOut } = useAuth();
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isAuthenticated = !!authState.user;

	const navLinks = [
		{ name: "Dashboard", path: "/dashboard" },
		{ name: "Transações", path: "/transactions" },
	];

	return (
		<header className="bg-card border-b border-dark">
			<div className="container-app">
				<div className="flex justify-between items-center py-4">
					{/* Logo */}
					<Link
						to="/"
						className="text-xl font-bold text-primary flex items-center space-x-2"
					>
						<Activity className="h-6 w-6" />
						<span>DevBills</span>
					</Link>

					{/* Links de navegação para desktop */}
					{isAuthenticated && (
						<nav className="hidden md:flex space-x-4">
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={
										pathname === link.path ? "nav-link-active" : "nav-link"
									}
								>
									{link.name}
								</Link>
							))}
						</nav>
					)}

					{/* Ações do usuário */}
					<div className="hidden md:flex items-center space-x-4">
						{isAuthenticated ? (
							<div className="flex items-center space-x-4">
								{/* Avatar e nome do usuário */}
								<div className="flex items-center space-x-2">
									{authState.user?.photoURL ? (
										<img
											src={authState.user.photoURL}
											alt={authState.user.displayName || "Usuário"}
											className="w-8 h-8 rounded-full border border-dark"
										/>
									) : (
										<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
											{authState.user?.displayName?.charAt(0) || "U"}
										</div>
									)}
									<span className="text-sm font-medium">
										{authState.user?.displayName || authState.user?.email}
									</span>
								</div>

								{/* Botão de logout */}
								<button
									onClick={signOut}
									className="text-muted hover:text-danger p-2 rounded-full hover:bg-opacity-10 hover:bg-red-500 transition-colors"
									title="Sair"
								>
									<LogOut size={20} />
								</button>
							</div>
						) : (
							<Link to="/login" className="btn btn-primary">
								Entrar
							</Link>
						)}
					</div>

					{/* Botão de menu móvel */}
					<div className="md:hidden flex items-center">
						<button
							className="text-muted p-2 rounded-lg hover:bg-lighter transition-colors"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Menu móvel */}
			{isMenuOpen && (
				<div className="md:hidden">
					<div className="container-app py-4 space-y-3 border-t border-dark">
						{isAuthenticated && (
							<>
								{/* Links de navegação */}
								<nav className="space-y-1">
									{navLinks.map((link) => (
										<Link
											key={link.path}
											to={link.path}
											className={`block px-3 py-2 rounded-lg ${
												pathname === link.path
													? "bg-lighter text-primary font-medium"
													: "text-muted hover:bg-lighter hover:text-primary"
											}`}
											onClick={() => setIsMenuOpen(false)}
										>
											{link.name}
										</Link>
									))}
								</nav>

								{/* Informações do usuário */}
								<div className="flex items-center justify-between pt-3 border-t border-dark">
									<div className="flex items-center space-x-2">
										{authState.user?.photoURL ? (
											<img
												src={authState.user.photoURL}
												alt={authState.user.displayName || "Usuário"}
												className="w-8 h-8 rounded-full border border-dark"
											/>
										) : (
											<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
												{authState.user?.displayName?.charAt(0) || "U"}
											</div>
										)}
										<span className="text-sm font-medium">
											{authState.user?.displayName || authState.user?.email}
										</span>
									</div>
									<button
										onClick={() => {
											signOut();
											setIsMenuOpen(false);
										}}
										className="text-muted hover:text-danger p-2 rounded-full hover:bg-opacity-10 hover:bg-red-500 transition-colors"
									>
										<LogOut size={20} />
									</button>
								</div>
							</>
						)}

						{!isAuthenticated && (
							<Link
								to="/login"
								className="btn btn-primary w-full"
								onClick={() => setIsMenuOpen(false)}
							>
								Entrar
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
