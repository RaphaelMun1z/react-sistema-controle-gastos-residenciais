import "./PeopleConsultPage.scss";

import DeleteIcon from "@mui/icons-material/Delete";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";
import { Alert, Button, Snackbar } from "@mui/material";
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
		key: "email",
		label: "E-mail",
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
	const { data: people = [], error, isError, isLoading, refetch } = usePeople();
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
					<Table
						columns={columns}
						rows={people}
						getRowId={(person) => person.id}
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

export default PeopleConsultPage;
