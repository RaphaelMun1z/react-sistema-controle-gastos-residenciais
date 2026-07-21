import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import Table, { type TableColumn } from "../../../../shared/components/Table/Table";

// Componentes do Material UI
import { Button, Pagination } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import {
	transactionsQueryKey,
	useTransactions,
} from "../../hooks/useTransactions";
import { transactionsService } from "../../services/transactionsService";
import { TransactionType, type Transaction } from "../../types/transaction";
import { transactionTypeLabels } from "../../utils/transactionLabels";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import { getApiErrorFeedback } from "../../../../shared/api/apiError";
import walletImage from "../../../../assets/images/wallet.png";
import { useAllPeople } from "../../../people/hooks/usePeople";
import { formatCurrency } from "../../../summary/utils/currency";

const columnHeader = (icon: ReactNode, label: string) => (
	<span className="table-column-header">
		{icon}
		{label}
	</span>
);

const cellWithIcon = (icon: ReactNode, value: ReactNode) => (
	<span className="table-cell-detail">
		{icon}
		<span>{value}</span>
	</span>
);

const transactionTypeBadge = (transaction: Transaction) => {
	const isRevenue = transaction.type === TransactionType.Revenue;
	const Icon = isRevenue ? ArrowUpwardIcon : ArrowDownwardIcon;

	return (
		<span
			className={`transaction-type-badge ${
				isRevenue ? "is-revenue" : "is-expense"
			}`}
		>
			<Icon fontSize="small" />
			{transactionTypeLabels[transaction.type]}
		</span>
	);
};

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
		label: columnHeader(<PersonOutlinedIcon fontSize="small" />, "Pessoa"),
		render: (transaction) => transaction.personId,
	},
	{
		key: "description",
		label: columnHeader(
			<DescriptionOutlinedIcon fontSize="small" />,
			"Descrição",
		),
		render: (transaction) =>
			cellWithIcon(
				<DescriptionOutlinedIcon fontSize="small" />,
				transaction.description,
			),
	},
	{
		key: "type",
		label: columnHeader(<SwapVertIcon fontSize="small" />, "Tipo"),
		render: transactionTypeBadge,
	},
	{
		key: "amount",
		label: columnHeader(<PaymentsOutlinedIcon fontSize="small" />, "Valor"),
		align: "right",
		render: (transaction) =>
			cellWithIcon(
				<PaymentsOutlinedIcon fontSize="small" />,
				formatCurrency(transaction.amount),
			),
	},
];

const TransactionsConsultPage = () => {
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const queryClient = useQueryClient();
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
						cellWithIcon(
							<PersonOutlinedIcon fontSize="small" />,
							peopleById.get(transaction.personId) ?? transaction.personId,
						),
				}
			: column,
	);

	useEffect(() => {
		const totalPages = data?.totalPages ?? 0;
		const nextPage = page + 1;

		if (nextPage <= totalPages) {
			void queryClient.prefetchQuery({
				queryKey: [...transactionsQueryKey, nextPage, pageSize] as const,
				queryFn: () =>
					transactionsService.getTransactions({ page: nextPage, pageSize }),
			});
		}
	}, [data?.totalPages, page, pageSize, queryClient]);

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

			<div
				className={`transactions-consult-page__table ${
					isFetching && transactions.length > 0 ? "is-fetching" : ""
				}`.trim()}
			>
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
