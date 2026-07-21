import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import Table, { type TableColumn } from "../../../../shared/components/Table/Table";

// Componentes do Material UI
import { Button, Pagination } from "@mui/material";
import { useState } from "react";

// Ícones
import AddIcon from "@mui/icons-material/Add";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { useTransactions } from "../../hooks/useTransactions";
import type { Transaction } from "../../types/transaction";
import { transactionTypeLabels } from "../../utils/transactionLabels";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import { getApiErrorFeedback } from "../../../../shared/api/apiError";
import walletImage from "../../../../assets/images/wallet.png";
import { useAllPeople } from "../../../people/hooks/usePeople";

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
		render: (transaction) => transaction.personId,
	},
	{
		key: "description",
		label: "Descrição",
	},
	{
		key: "type",
		label: "Tipo",
		render: (transaction) => transactionTypeLabels[transaction.type],
	},
	{
		key: "amount",
		label: "Valor",
		align: "right",
		render: (transaction) =>
			transaction.amount.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}),
	},
];

const TransactionsConsultPage = () => {
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const {
		data,
		error,
		isError,
		isLoading,
		isFetching,
		refetch,
	} = useTransactions({ page, pageSize });
	const { data: people = [] } = useAllPeople();
	const peopleById = new Map(people.map((person) => [person.id, person.name]));
	const transactions = data?.content ?? [];
	const errorFeedback = getApiErrorFeedback(error, "transactionsList");
	const columnsWithPersonName: TableColumn<Transaction>[] = columns.map((column) =>
		column.key === "person"
			? {
					...column,
					render: (transaction) =>
						peopleById.get(transaction.personId) ?? transaction.personId,
				}
			: column,
	);

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
					<>
						<span className="transactions-consult-page__total">
							{data?.totalElements ?? 0} transações registradas
							{isFetching ? " - atualizando..." : ""}
						</span>
						<Table
							columns={columnsWithPersonName}
							rows={transactions}
							getRowId={(transaction) => transaction.id}
						/>
						{(data?.totalPages ?? 0) > 1 && (
							<Pagination
								className="transactions-consult-page__pagination"
								page={page}
								count={data?.totalPages ?? 1}
								onChange={(_event, nextPage) => setPage(nextPage)}
								color="primary"
							/>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default TransactionsConsultPage;
