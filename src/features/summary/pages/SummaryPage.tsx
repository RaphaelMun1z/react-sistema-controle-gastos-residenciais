import { useMemo, useState } from "react";
import "./SummaryPage.scss";

// Componentes
import PageHeader from "../../../components/PageHeader/PageHeader";
import { ROUTES } from "../../../app/routes/paths";

// Componentes do Material UI
import {
	Avatar,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";

// Ícones
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { deepOrange } from "@mui/material/colors";

// Interfaces
interface PersonSummary {
	id: number;
	name: string;
	income: number;
	expenses: number;
	balance: number;
}

// Cabeçalho da página
const SummaryHeaderData = {
	sector: "Resumo",
	sectorPath: ROUTES.summary,
	currentPage: "Consultar",
	title: "Resumo Financeiro",
};

// Dados temporários
const peopleSummary: PersonSummary[] = [
	{
		id: 1,
		name: "Raphael Muniz",
		income: 5000,
		expenses: 2350.75,
		balance: 2649.25,
	},
	{
		id: 2,
		name: "João Silva",
		income: 3200,
		expenses: 1980.5,
		balance: 1219.5,
	},
	{
		id: 3,
		name: "Maria Souza",
		income: 4500,
		expenses: 4720,
		balance: -220,
	},
];

// Formata valores em Real
const formatCurrency = (value: number) =>
	value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

const SummaryPage = () => {
	// Filtros
	const [selectedPerson, setSelectedPerson] = useState("all");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	// Filtra os registros por pessoa
	const filteredPeople = useMemo(() => {
		if (selectedPerson === "all") {
			return peopleSummary;
		}

		return peopleSummary.filter(
			(person) => person.id === Number(selectedPerson),
		);
	}, [selectedPerson]);

	// Totais gerais considerando os filtros aplicados
	const totalIncome = filteredPeople.reduce(
		(total, person) => total + person.income,
		0,
	);

	const totalExpenses = filteredPeople.reduce(
		(total, person) => total + person.expenses,
		0,
	);

	const totalBalance = totalIncome - totalExpenses;

	// Limpa todos os filtros
	const handleClearFilters = () => {
		setSelectedPerson("all");
		setStartDate("");
		setEndDate("");
	};

	return (
		<section className="section-container">
			<PageHeader data={SummaryHeaderData} />

			<div className="summary-filters">
				<div className="filters-header">
					<FilterAltIcon />

					<div>
						<strong>Filtros</strong>
					</div>
				</div>

				<div className="filters-fields">
					<FormControl size="small">
						<InputLabel id="person-filter-label">Pessoa</InputLabel>

						<Select
							labelId="person-filter-label"
							label="Pessoa"
							value={selectedPerson}
							onChange={(event) =>
								setSelectedPerson(event.target.value)
							}
						>
							<MenuItem value="all">Todas as pessoas</MenuItem>

							{peopleSummary.map((person) => (
								<MenuItem
									key={person.id}
									value={String(person.id)}
								>
									{person.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label="Data inicial"
						type="date"
						size="small"
						value={startDate}
						onChange={(event) => setStartDate(event.target.value)}
						slotProps={{
							inputLabel: {
								shrink: true,
							},
						}}
					/>

					<TextField
						label="Data final"
						type="date"
						size="small"
						value={endDate}
						onChange={(event) => setEndDate(event.target.value)}
						slotProps={{
							inputLabel: {
								shrink: true,
							},
						}}
					/>

					<Button
						variant="text"
						startIcon={<RestartAltIcon />}
						onClick={handleClearFilters}
						sx={{
							color: "#6b7280",
							textTransform: "none",
						}}
					>
						Limpar
					</Button>
				</div>
			</div>

			<div className="summary-layout">
				<div className="scroll-container">
					<div className="summary-container">
						{filteredPeople.map((person) => (
							<article key={person.id} className="person-summary">
								<header className="person-summary-header">
									<Avatar
										sx={{
											width: 30,
											height: 30,
											bgcolor: deepOrange[500],
											fontSize: "0.75rem",
										}}
									>
										{person.name.charAt(0)}
									</Avatar>
									<h2>{person.name}</h2>
								</header>

								<div className="summary-items">
									<div className="summary-item">
										<div className="summary-item-content">
											<div className="summary-icon income">
												<TrendingUpIcon />
											</div>

											<div>
												<strong>Receitas</strong>
												<p>Total recebido</p>
											</div>
										</div>

										<span className="summary-value income-value">
											{formatCurrency(person.income)}
										</span>
									</div>

									<div className="summary-item">
										<div className="summary-item-content">
											<div className="summary-icon expense">
												<TrendingDownIcon />
											</div>

											<div>
												<strong>Despesas</strong>
												<p>Total gasto</p>
											</div>
										</div>

										<span className="summary-value expense-value">
											- {formatCurrency(person.expenses)}
										</span>
									</div>

									<div className="summary-item">
										<div className="summary-item-content">
											<div className="summary-icon balance">
												<AccountBalanceWalletIcon />
											</div>

											<div>
												<strong>Saldo</strong>
												<p>Receitas - despesas</p>
											</div>
										</div>

										<span
											className={`summary-value ${
												person.balance >= 0
													? "positive-balance"
													: "negative-balance"
											}`}
										>
											{formatCurrency(person.balance)}
										</span>
									</div>
								</div>
							</article>
						))}
					</div>
				</div>

				<aside className="summary-aside">
					<section className="overview-section">
						<h3>Visão Geral</h3>

						<div className="overview-items">
							<div className="overview-item">
								<div className="overview-label">
									<TrendingUpIcon className="overview-icon income" />

									<div>
										<strong>Receitas</strong>
										<p>Total recebido</p>
									</div>
								</div>

								<span className="income-value">
									{formatCurrency(totalIncome)}
								</span>
							</div>

							<div className="overview-item">
								<div className="overview-label">
									<TrendingDownIcon className="overview-icon expense" />

									<div>
										<strong>Despesas</strong>
										<p>Total gasto</p>
									</div>
								</div>

								<span className="expense-value">
									{formatCurrency(totalExpenses)}
								</span>
							</div>

							<div className="overview-item">
								<div className="overview-label">
									<AccountBalanceWalletIcon className="overview-icon balance" />

									<div>
										<strong>Saldo</strong>
										<p>Receitas - despesas</p>
									</div>
								</div>

								<span
									className={
										totalBalance >= 0
											? "positive-balance"
											: "negative-balance"
									}
								>
									{formatCurrency(totalBalance)}
								</span>
							</div>
						</div>
					</section>

					<section className="ai-analysis-card">
						<div className="ai-card-icon">
							<AutoAwesomeIcon />
						</div>

						<div className="ai-card-content">
							<h3>Analise suas finanças com IA</h3>

							<p>
								Receba uma análise inteligente das suas
								transações, identifique padrões de gastos e
								descubra oportunidades para economizar.
							</p>

							<button type="button">Analisar transações</button>
						</div>
					</section>
				</aside>
			</div>
		</section>
	);
};

export default SummaryPage;
