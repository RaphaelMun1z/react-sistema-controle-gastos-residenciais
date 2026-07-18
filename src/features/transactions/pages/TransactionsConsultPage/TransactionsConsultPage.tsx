import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";

// Componentes do Material UI
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { useState } from "react";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import {
	useRemoveTransaction,
	useTransactions,
} from "../../hooks/useTransactions";
import type { Transaction } from "../../types/transaction";
import { transactionTypeLabels } from "../../utils/transactionLabels";

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
	const { data: transactions = [], isLoading, isError } = useTransactions();
	const removeTransaction = useRemoveTransaction();
	const [feedbackMessage, setFeedbackMessage] = useState("");

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
					removeTransaction.mutate(transaction.id, {
						onSuccess: () =>
							setFeedbackMessage("Transação excluída com sucesso."),
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
				{isLoading && (
					<CircularProgress aria-label="Carregando transações" />
				)}

				{isError && (
					<Alert severity="error">
						Não foi possível carregar as transações.
					</Alert>
				)}

				{!isLoading && !isError && (
					<Table
						columns={columns}
						rows={transactions}
						getRowId={(transaction) => transaction.id}
						actions={actions}
						emptyMessage="Nenhuma transação registrada."
					/>
				)}
			</div>

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
