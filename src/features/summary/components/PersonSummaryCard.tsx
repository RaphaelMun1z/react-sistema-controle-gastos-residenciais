import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import type { PersonSummary } from "../types/summary";
import { formatCurrency, formatNegativeCurrency } from "../utils/currency";
import SignedAmount from "./SignedAmount";

interface PersonSummaryCardProps {
	person: PersonSummary;
}

const PersonSummaryCard = ({ person }: PersonSummaryCardProps) => {
	const balance = person.income - person.expenses;

	return (
		<article className="person-summary">
			<header className="person-summary-header">
				<Avatar
					sx={{
						width: 30,
						height: 30,
						bgcolor: deepOrange[500],
						fontSize: "0.75rem",
					}}
				>
					{person.personName.charAt(0)}
				</Avatar>
				<h2>{person.personName}</h2>
			</header>

			<div className="summary-items">
				<div className="summary-item">
					<div className="summary-item-content">
						<div className="summary-icon income" aria-hidden="true">
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
						<div className="summary-icon expense" aria-hidden="true">
							<TrendingDownIcon />
						</div>

						<div>
							<strong>Despesas</strong>
							<p>Total gasto</p>
						</div>
					</div>

					<span className="summary-value expense-value">
						<TrendingDownIcon className="summary-value__icon" />
						{formatNegativeCurrency(person.expenses)}
					</span>
				</div>

				<div className="summary-item">
					<div className="summary-item-content">
						<div className="summary-icon balance" aria-hidden="true">
							<AccountBalanceWalletIcon />
						</div>

						<div>
							<strong>Saldo</strong>
						</div>
					</div>

					<SignedAmount
						value={balance}
						className={`summary-value ${
							balance >= 0 ? "positive-balance" : "negative-balance"
						}`}
					/>
				</div>
			</div>
		</article>
	);
};

export default PersonSummaryCard;
