import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import Table, {
	type TableColumn,
} from "../../../../shared/components/Table/Table";

// Componentes do Material UI
import { Button, Pagination } from "@mui/material";
import { useEffect, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

// React Router
import { Link, useSearchParams } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionType, type Transaction } from "../../types/transaction";
import { transactionTypeLabels } from "../../utils/transactionLabels";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import { getApiErrorFeedback } from "../../../../shared/api/apiError";
import walletImage from "../../../../assets/images/wallet.png";
import { peopleQueryKey } from "../../../people/hooks/usePeople";
import type { Person } from "../../../people/types/person";
import { formatCurrency } from "../../../summary/utils/currency";
import type { PagedResponse } from "../../../../shared/api/apiTypes";
import { formatDateOnly } from "../../../../shared/utils/dateOnly";

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
		key: "transactionDate",
		label: columnHeader(<CalendarTodayOutlinedIcon fontSize="small" />, "Data"),
		render: (transaction) =>
			cellWithIcon(
				<CalendarTodayOutlinedIcon fontSize="small" />,
				formatDateOnly(transaction.transactionDate),
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
	const [searchParams, setSearchParams] = useSearchParams();
	const requestedPage = Number(searchParams.get("page") ?? "1");
	const page =
		Number.isInteger(requestedPage) && requestedPage >= 1 ? requestedPage : 1;
	const pageSize = 10;
	const queryClient = useQueryClient();
	const { data, error, isError, isLoading, isFetching, refetch } =
		useTransactions({ page, pageSize });
	const peopleById = useMemo(() => {
		const cachedPeoplePages = queryClient.getQueriesData<PagedResponse<Person>>(
			{
				queryKey: peopleQueryKey,
			},
		);

		return new Map(
			cachedPeoplePages.flatMap(([, page]) =>
				(page?.content ?? []).map(
					(person) => [person.id, person.name] as const,
				),
			),
		);
	}, [queryClient]);
	const transactions = data?.content ?? [];
	const errorFeedback = getApiErrorFeedback(error, "transactionsList");
	const columnsWithPersonName: TableColumn<Transaction>[] = columns.map(
		(column) =>
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
		if (searchParams.get("page") && page !== requestedPage) {
			setSearchParams({ page: "1" }, { replace: true });
		}
	}, [page, requestedPage, searchParams, setSearchParams]);

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
								onChange={(_event, nextPage) =>
									setSearchParams({ page: String(nextPage) })
								}
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
