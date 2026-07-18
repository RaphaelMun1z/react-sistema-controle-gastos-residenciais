import React from "react";
import "./Template.scss";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { useAuth } from "../../../../features/authentication/hooks/useAuth";

// Assets
import logo from "../../../../assets/images/rm-logo-branco.png";

// Componentes do Material UI
import {
	Avatar,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tab,
	Tabs,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";

// Ícones do Material Icons
import Groups2Icon from "@mui/icons-material/Groups2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import LogoutIcon from "@mui/icons-material/Logout";

// Itens da barra de navegação
const navItems = [
	{
		value: "pessoas",
		label: "Pessoas",
		path: ROUTES.people,
		icon: <Groups2Icon />,
	},
	{
		value: "transacoes",
		label: "Transações",
		path: ROUTES.transactions,
		icon: <ReceiptLongIcon />,
	},
	{
		value: "resumo",
		label: "Resumo",
		path: ROUTES.summary,
		icon: <PaidIcon />,
	},
];

const Template = () => {
	// Hooks responsáveis pela navegação e identificação da rota atual
	const navigate = useNavigate();
	const location = useLocation();
	const { signOut, user } = useAuth();

	// Identifica o item da navbar correspondente à rota atual
	const currentNavItem = navItems.find((item) =>
		location.pathname.startsWith(item.path),
	);

	// Define qual item da navbar ficará selecionado
	const value = currentNavItem?.value ?? "pessoas";

	// Navega para a rota correspondente ao item selecionado
	const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
		const selectedItem = navItems.find((item) => item.value === newValue);

		if (selectedItem) {
			navigate(selectedItem.path);
		}
	};

	// Redireciona para a página de login
	const handleLogout = async () => {
		try {
			await signOut();
		} finally {
			navigate(ROUTES.signIn);
		}
	};

	return (
		<div className="base-container">
			<div className="template-container">
				<aside className="aside-container">
					<div className="aside-content-container">
						<header className="aside-header-container">
							<Avatar
								sx={{
									width: 70,
									height: 70,
									bgcolor: deepOrange[500],
								}}
							>
								{user?.name.charAt(0).toUpperCase() ?? "U"}
							</Avatar>
							<h2>{user?.name ?? "Usuário"}</h2>
							<p>{user?.email ?? "API indisponível"}</p>
						</header>
						<nav className="navbar-container">
							<div className="links-container">
								<Tabs
									orientation="vertical"
									value={value}
									onChange={handleChange}
									className="navigation-tabs"
								>
									{navItems.map((item) => (
										<Tab
											key={item.value}
											value={item.value}
											label={item.label}
											icon={item.icon}
											iconPosition="start"
											className="navigation-tab"
										/>
									))}
								</Tabs>
							</div>
						</nav>
						<footer>
							<ListItemButton
								onClick={handleLogout}
								sx={{
									width: "100%",
									color: "rgba(241, 14, 14, 0.7)",
									px: 2,
									py: 1.5,

									"&:hover": {
										color: "#f17474",
										backgroundColor:
											"rgba(241, 14, 14, 0.08)",
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 40,
										color: "inherit",
									}}
								>
									<LogoutIcon sx={{ fontSize: 28 }} />
								</ListItemIcon>

								<ListItemText
									primary="Sair"
									slotProps={{
										primary: {
											sx: {
												fontSize: "1.1rem",
												fontWeight: 500,
											},
										},
									}}
								/>
							</ListItemButton>
						</footer>
					</div>
				</aside>
				<div className="view-page-container">
					<main className="main-content-container">
						<Outlet />
					</main>
				</div>
			</div>
			<div className="author-container">
				<p>Desenvolvido por </p>
				<img src={logo} alt="Logo Raphael Muniz" />
			</div>
		</div>
	);
};

export default Template;
