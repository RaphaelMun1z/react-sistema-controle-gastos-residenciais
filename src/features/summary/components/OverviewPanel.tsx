import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import type { PersonSummary } from "../types/summary";
import { formatCurrency } from "../utils/currency";

interface OverviewPanelProps {
	summary: PersonSummary[];
}

const OverviewPanel = ({ summary }: OverviewPanelProps) => {
	// O total geral é derivado dos totais individuais retornados por /summary.
	const totalIncome = summary.reduce(
		(total, person) => total + person.income,
		0,
	);
	const totalExpenses = summary.reduce(
		(total, person) => total + person.expenses,
		0,
	);
	const totalBalance = totalIncome - totalExpenses;

	return (
		<section className="overview-section" aria-labelledby="overview-title">
			<h3 id="overview-title">Visão Geral</h3>

			<div className="overview-items">
				<div className="overview-item">
					<div className="overview-label">
						<TrendingUpIcon className="overview-icon income" />

						<div>
							<strong>Receitas</strong>
							<p>Total recebido</p>
						</div>
					</div>

					<span className="income-value">{formatCurrency(totalIncome)}</span>
				</div>

				<div className="overview-item">
					<div className="overview-label">
						<TrendingDownIcon className="overview-icon expense" />

						<div>
							<strong>Despesas</strong>
							<p>Total gasto</p>
						</div>
					</div>

					<span className="expense-value">{formatCurrency(totalExpenses)}</span>
				</div>

				<div className="overview-item">
					<div className="overview-label">
						<AccountBalanceWalletIcon className="overview-icon balance" />

						<div>
							<strong>Saldo</strong>
						</div>
					</div>

					<span
						className={
							totalBalance >= 0 ? "positive-balance" : "negative-balance"
						}
					>
						{totalBalance >= 0 ? "Positivo: " : "Negativo: "}
						{formatCurrency(totalBalance)}
					</span>
				</div>
			</div>
		</section>
	);
};

export default OverviewPanel;
