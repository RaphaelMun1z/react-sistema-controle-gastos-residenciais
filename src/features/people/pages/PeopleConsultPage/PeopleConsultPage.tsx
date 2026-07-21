import "./PeopleConsultPage.scss";

import DeleteIcon from "@mui/icons-material/Delete";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";
import { Alert, Button, Pagination, Snackbar } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { PersonAdd } from "@mui/icons-material";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import TableSkeleton from "../../../../shared/components/skeletons/TableSkeleton";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
} from "../../../../shared/api/apiError";
import { peopleQueryKey, useDeletePerson, usePeople } from "../../hooks/usePeople";
import { peopleService } from "../../services/peopleService";
import type { Person } from "../../types/person";

interface PeopleConsultLocationState {
	feedbackMessage?: string;
}

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

const columns: TableColumn<Person>[] = [
	{
		key: "name",
		label: columnHeader(<PersonOutlinedIcon fontSize="small" />, "Nome"),
		render: (person) =>
			cellWithIcon(<PersonOutlinedIcon fontSize="small" />, person.name),
	},
	{
		key: "birthDate",
		label: columnHeader(<CakeOutlinedIcon fontSize="small" />, "Nascimento"),
		render: (person) =>
			cellWithIcon(
				<CakeOutlinedIcon fontSize="small" />,
				new Intl.DateTimeFormat("pt-BR").format(
					new Date(`${person.birthDate}T00:00:00`),
				),
			),
	},
	{
		key: "age",
		label: columnHeader(<BadgeOutlinedIcon fontSize="small" />, "Idade"),
		align: "right",
		render: (person) => `${person.age} anos`,
	},
];

const PeopleConsultHeaderData = {
	sector: "Pessoas",
	sectorPath: "/pessoas",
	currentPage: "Consultar",
	title: "Pessoas Registradas",
};

const PeopleConsultPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const {
		data,
		error,
		isError,
		isLoading,
		isFetching,
		refetch,
	} = usePeople({ page, pageSize });
	const people = data?.content ?? [];
	const errorFeedback = getApiErrorFeedback(error, "peopleList");
	const deletePerson = useDeletePerson();
	const routeFeedback = (location.state as PeopleConsultLocationState | null)
		?.feedbackMessage;
	const [feedbackMessage, setFeedbackMessage] = useState(routeFeedback ?? "");
	const [feedbackError, setFeedbackError] = useState("");

	useEffect(() => {
		if (routeFeedback) {
			navigate(location.pathname, { replace: true, state: null });
		}
	}, [location.pathname, navigate, routeFeedback]);

	useEffect(() => {
		const totalPages = data?.totalPages ?? 0;
		const nextPage = page + 1;

		if (nextPage <= totalPages) {
			void queryClient.prefetchQuery({
				queryKey: [...peopleQueryKey, nextPage, pageSize] as const,
				queryFn: () => peopleService.getPeople({ page: nextPage, pageSize }),
			});
		}
	}, [data?.totalPages, page, pageSize, queryClient]);

	const actions: TableAction<Person>[] = [
		{
			label: "Excluir",
			icon: <DeleteIcon />,
			color: "error",
			onClick: (person) => {
				const shouldRemove = window.confirm(
					`Deseja excluir ${person.name}? As transações dessa pessoa também serão removidas.`,
				);

				if (shouldRemove) {
					deletePerson.mutate(person.id, {
						onSuccess: () => setFeedbackMessage("Pessoa excluída com sucesso."),
						onError: (error) =>
							setFeedbackError(getApiErrorTitle(error, "peopleDelete")),
					});
				}
			},
		},
	];

	return (
		<section className="people-consult-page">
			<PageHeader data={PeopleConsultHeaderData} />

			<div className="people-consult-page__create">
				<Button
					component={Link}
					variant="outlined"
					to={ROUTES.personRegister}
					startIcon={<PersonAdd />}
				>
					Registrar pessoa
				</Button>
			</div>

			<div
				className={`people-consult-page__table ${
					isFetching && people.length > 0 ? "is-fetching" : ""
				}`.trim()}
			>
				{isLoading && <TableSkeleton columns={columns.length} />}

				{isError && (
					<ErrorState
						title={errorFeedback.title}
						description={errorFeedback.description}
						actionLabel={errorFeedback.actionLabel}
						onRetry={() => void refetch()}
					/>
				)}

				{!isLoading && !isError && people.length === 0 && (
					<EmptyState
						title="Nenhuma pessoa cadastrada ainda."
						description="Cadastre uma pessoa para começar a registrar e acompanhar suas transações."
					/>
				)}

				{!isLoading && !isError && people.length > 0 && (
					<>
						<span className="people-consult-page__total">
							{data?.totalElements ?? 0} pessoas cadastradas
							{isFetching ? " - atualizando..." : ""}
						</span>
						<Table
							columns={columns}
							rows={people}
							getRowId={(person) => person.id}
							actions={actions}
						/>
						{(data?.totalPages ?? 0) > 1 && (
							<Pagination
								className="people-consult-page__pagination"
								page={page}
								count={data?.totalPages ?? 1}
								onChange={(_event, nextPage) => setPage(nextPage)}
								color="primary"
							/>
						)}
					</>
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

export default PeopleConsultPage;
