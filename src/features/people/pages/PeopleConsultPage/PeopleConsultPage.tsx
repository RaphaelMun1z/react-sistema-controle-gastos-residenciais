import "./PeopleConsultPage.scss";

import DeleteIcon from "@mui/icons-material/Delete";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";
import { Alert, Button, Pagination, Snackbar } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";
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
import { useDeletePerson, usePeople } from "../../hooks/usePeople";
import type { Person } from "../../types/person";

interface PeopleConsultLocationState {
	feedbackMessage?: string;
}

const columns: TableColumn<Person>[] = [
	{
		key: "name",
		label: "Nome",
	},
	{
		key: "birthDate",
		label: "Nascimento",
		render: (person) =>
			new Intl.DateTimeFormat("pt-BR").format(
				new Date(`${person.birthDate}T00:00:00`),
			),
	},
	{
		key: "age",
		label: "Idade",
		align: "right",
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

			<div className="people-consult-page__table">
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
