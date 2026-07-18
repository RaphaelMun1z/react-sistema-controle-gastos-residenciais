import React from "react";
import "./template.scss";

import logo from "../../assets/rm-logo-branco.png";
import {
	Avatar,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tab,
	Tabs,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import Groups2Icon from "@mui/icons-material/Groups2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import LogoutIcon from "@mui/icons-material/Logout";

const Template = ({ children }: any) => {
	const [value, setValue] = React.useState("recents");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	const handleLogout = () => {
		window.location.href = "/login";
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
								RM
							</Avatar>
							<h2>Raphael Muniz</h2>
							<p>raphaelmunizvarela@gmail.com</p>
						</header>
						<nav className="navbar-container">
							<div className="links-container">
								<Tabs
									orientation="vertical"
									value={value}
									onChange={handleChange}
									className="navigation-tabs"
								>
									<Tab
										value="pessoas"
										label="Pessoas"
										icon={<Groups2Icon />}
										iconPosition="start"
										className="navigation-tab"
									/>

									<Tab
										value="transacoes"
										label="Transações"
										icon={<ReceiptLongIcon />}
										iconPosition="start"
										className="navigation-tab"
									/>

									<Tab
										value="total"
										label="Totais"
										icon={<PaidIcon />}
										iconPosition="start"
										className="navigation-tab"
									/>
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
					<div className="main-content-container">{children}</div>
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
