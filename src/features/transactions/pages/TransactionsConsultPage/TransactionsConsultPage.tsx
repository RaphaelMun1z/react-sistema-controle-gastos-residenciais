import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";

// Componentes do Material UI
import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import {
	useDeleteTransaction,
	useTransactions,
} from "../../hooks/useTransactions";
import type { Transaction } from "../../types/transaction";
import { transactionTypeLabels } from "../../utils/transactionLabels";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
} from "../../../../shared/api/apiError";
import walletImage from "../../../../assets/images/wallet.png";

// Cabeçalho da página
const TransactionsConsultHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Consultar",
	title: "Transações Registradas",
};

// Colunas da tabela de transações
const columns: TableColumn<Transaction>[] = [
	{
		key: "person",
		label: "Pessoa",
		render: (transaction) => transaction.personName,
	},
	{
		key: "description",
		label: "Descrição",
	},
	{
		key: "category",
		label: "Categoria",
	},
	{
		key: "type",
		label: "Tipo",
		render: (transaction) => transactionTypeLabels[transaction.type],
	},
	{
		key: "value",
		label: "Valor",
		align: "right",
		render: (transaction) =>
			transaction.value.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}),
	},
	{
		key: "date",
		label: "Data",
		render: (transaction) =>
			new Intl.DateTimeFormat("pt-BR").format(
				new Date(`${transaction.date}T00:00:00`),
			),
	},
];

const TransactionsConsultPage = () => {
	const {
		data: transactions = [],
		error,
		isError,
		isLoading,
		refetch,
	} = useTransactions();
	const errorFeedback = getApiErrorFeedback(error, "transactionsList");
	const deleteTransaction = useDeleteTransaction();
	const [feedbackMessage, setFeedbackMessage] = useState("");
	const [feedbackError, setFeedbackError] = useState("");

	const actions: TableAction<Transaction>[] = [
		{
			label: "Excluir",
			icon: <DeleteIcon />,
			color: "error",
			onClick: (transaction) => {
				const shouldRemove = window.confirm(
					`Deseja excluir "${transaction.description}"?`,
				);

				if (shouldRemove) {
					deleteTransaction.mutate(transaction.id, {
						onSuccess: () =>
							setFeedbackMessage("Transação excluída com sucesso."),
						onError: (error) =>
							setFeedbackError(getApiErrorTitle(error, "transactionsDelete")),
					});
				}
			},
		},
	];

	return (
		<section className="transactions-consult-page">
			<PageHeader data={TransactionsConsultHeaderData} />

			<div className="transactions-consult-page__create">
				<Button
					component={Link}
					to={ROUTES.transactionRegister}
					variant="outlined"
					startIcon={<AddIcon />}
				>
					Registrar transação
				</Button>
			</div>

			<div className="transactions-consult-page__table">
				{isLoading && <TableSkeleton columns={columns.length} rows={6} />}

				{isError && (
					<ErrorState
						title={errorFeedback.title}
						description={errorFeedback.description}
						actionLabel={errorFeedback.actionLabel}
						onRetry={() => void refetch()}
					/>
				)}

				{!isLoading && !isError && transactions.length === 0 && (
					<EmptyState
						title="Nenhuma transação encontrada."
						description="Registre uma nova transação ou ajuste os filtros utilizados."
						image={walletImage}
						imageAlt="Carteira vazia"
					/>
				)}

				{!isLoading && !isError && transactions.length > 0 && (
					<Table
						columns={columns}
						rows={transactions}
						getRowId={(transaction) => transaction.id}
						actions={actions}
					/>
				)}
			</div>

			{feedbackError && (
				<Alert severity="error" onClose={() => setFeedbackError("")}>
					{feedbackError}
				</Alert>
			)}

			<Snackbar
				open={Boolean(feedbackMessage)}
				autoHideDuration={3000}
				onClose={() => setFeedbackMessage("")}
				message={feedbackMessage}
			/>
		</section>
	);
};

export default TransactionsConsultPage;
