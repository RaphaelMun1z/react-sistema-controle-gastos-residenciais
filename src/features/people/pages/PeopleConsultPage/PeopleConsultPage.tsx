import "./PeopleConsultPage.scss";

// Ícones do Material Icons
import DeleteIcon from "@mui/icons-material/Delete";

// Componentes do Material UI
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";
import { Alert, Button, Snackbar } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useState } from "react";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";

// Componentes Locais
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import LoadingState from "../../../../shared/components/DataState/LoadingState";
import { getApiErrorMessage } from "../../../../shared/api/apiError";
import { useDeletePerson, usePeople } from "../../hooks/usePeople";
import type { Person } from "../../types/person";

// Colunas da tabela de pessoas
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
	const {
		data: people = [],
		error,
		isError,
		isLoading,
		refetch,
	} = usePeople();
	const deletePerson = useDeletePerson();
	const [feedbackMessage, setFeedbackMessage] = useState("");
	const [feedbackError, setFeedbackError] = useState("");

	const actions: TableAction<Person>[] = [
		{
			label: "Excluir",
			icon: <DeleteIcon />,
			color: "error",
			onClick: (person) => {
				const shouldRemove = window.confirm(
					`Deseja excluir ${person.name}?`,
				);

				if (shouldRemove) {
					deletePerson.mutate(person.id, {
						onSuccess: () =>
							setFeedbackMessage("Pessoa excluída com sucesso."),
						onError: (error) =>
							setFeedbackError(getApiErrorMessage(error)),
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
				{isLoading && <LoadingState label="Carregando pessoas" />}

				{isError && (
					<ErrorState
						title="Não foi possível carregar as pessoas"
						description={getApiErrorMessage(error)}
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
