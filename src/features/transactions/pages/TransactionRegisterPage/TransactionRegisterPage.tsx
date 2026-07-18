import "./TransactionRegisterPage.scss";

// Componentes do Material UI
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";

// Ícones do Material Icons
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

// Componentes Locais
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { Link } from "react-router";

const TransactionsRegisterHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Registrar",
	title: "Registrar Transação",
};

const TransactionRegisterPage = () => {
	return (
		<section className="section-container">
			<PageHeader data={TransactionsRegisterHeaderData} />

			<div className="form-container">
				<form className="transaction-form">
					<div className="form-grid">
						<FormControl fullWidth>
							<InputLabel id="person-label">Pessoa</InputLabel>

							<Select
								labelId="person-label"
								label="Pessoa"
								defaultValue=""
							>
								<MenuItem value="">
									<em>Selecione uma pessoa</em>
								</MenuItem>

								<MenuItem value="1">Raphael Muniz</MenuItem>

								<MenuItem value="2">João Silva</MenuItem>
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel id="type-label">Tipo</InputLabel>

							<Select
								labelId="type-label"
								label="Tipo"
								defaultValue=""
							>
								<MenuItem value="entrada">Entrada</MenuItem>

								<MenuItem value="saida">Saída</MenuItem>
							</Select>
						</FormControl>

						<TextField
							label="Descrição"
							placeholder="Ex.: Conta de energia"
							fullWidth
						/>

						<TextField label="Valor" type="number" fullWidth />

						<FormControl fullWidth>
							<InputLabel id="category-label">
								Categoria
							</InputLabel>

							<Select
								labelId="category-label"
								label="Categoria"
								defaultValue=""
							>
								<MenuItem value="alimentacao">
									Alimentação
								</MenuItem>

								<MenuItem value="moradia">Moradia</MenuItem>

								<MenuItem value="transporte">
									Transporte
								</MenuItem>

								<MenuItem value="saude">Saúde</MenuItem>

								<MenuItem value="outros">Outros</MenuItem>
							</Select>
						</FormControl>

						<TextField
							label="Data"
							type="date"
							fullWidth
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
					</div>

					<div className="form-observation">
						<TextField
							label="Observação"
							multiline
							rows={3}
							fullWidth
						/>
					</div>

					<div className="form-actions">
						<Button
							component={Link}
							to="/transacoes"
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

export default TransactionRegisterPage;
