import "./PersonRegisterPage.scss";

// Componentes do Material UI
import { Button, TextField } from "@mui/material";

// Ícones do Material Icons
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";

// Componentes Locais
import PageHeader from "../../../../components/PageHeader/PageHeader";

const PersonRegisterHeaderData = {
	sector: "Pessoas",
	sectorPath: "/pessoas",
	currentPage: "Registrar",
	title: "Registrar Pessoa",
};

const PersonRegisterPage = () => {
	return (
		<section className="section-container">
			<PageHeader data={PersonRegisterHeaderData} />

			<div className="form-container">
				<form className="person-form">
					<div className="form-grid">
						<TextField
							label="Nome"
							placeholder="Nome completo"
							fullWidth
						/>

						<TextField
							label="E-mail"
							type="email"
							placeholder="exemplo@email.com"
							fullWidth
						/>

						<TextField label="Idade" type="number" fullWidth />
					</div>

					<div className="form-actions">
						<Button
							component={Link}
							to={ROUTES.people}
							variant="outlined"
							startIcon={<CloseIcon />}
							sx={{
								color: "#6b7280",
								borderColor: "#d1d5db",
								boxShadow: "none",

								"&:hover": {
									borderColor: "#9ca3af",
									backgroundColor: "#f3f4f6",
									boxShadow: "none",
								},
							}}
						>
							Cancelar
						</Button>

						<Button
							variant="contained"
							startIcon={<SaveIcon />}
							sx={{
								backgroundColor: "#2e7d32",
								boxShadow: "none",

								"&:hover": {
									backgroundColor: "#256b2a",
									boxShadow: "none",
								},
							}}
						>
							SALVAR
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default PersonRegisterPage;
