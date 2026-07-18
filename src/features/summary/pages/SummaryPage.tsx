import "./SummaryPage.scss";

// Componentes
import PageHeader from "../../../components/PageHeader/PageHeader";

// Ícones
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

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
	sectorPath: "/resumo",
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
	return (
		<section className="section-container">
			<PageHeader data={SummaryHeaderData} />

			<div className="scroll-container">
				<div className="summary-container">
					{peopleSummary.map((person) => (
						<article key={person.id} className="person-summary">
							<header className="person-summary-header">
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
		</section>
	);
};

export default SummaryPage;
