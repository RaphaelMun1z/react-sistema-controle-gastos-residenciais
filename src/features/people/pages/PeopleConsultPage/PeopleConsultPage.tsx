import "./PeopleConsultPage.scss";

// Ícones do Material Icons
import DeleteIcon from "@mui/icons-material/Delete";

// Componentes do Material UI
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../shared/components/Table/Table";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useState } from "react";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";

// Componentes Locais
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import { usePeople, useRemovePerson } from "../../hooks/usePeople";
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
	const { data: people = [], isLoading, isError } = usePeople();
	const removePerson = useRemovePerson();
	const [feedbackMessage, setFeedbackMessage] = useState("");

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
					removePerson.mutate(person.id, {
						onSuccess: () =>
							setFeedbackMessage("Pessoa excluída com sucesso."),
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
				{isLoading && <CircularProgress aria-label="Carregando pessoas" />}

				{isError && (
					<Alert severity="error">
						Não foi possível carregar as pessoas.
					</Alert>
				)}

				{!isLoading && !isError && (
					<Table
						columns={columns}
						rows={people}
						getRowId={(person) => person.id}
						actions={actions}
						emptyMessage="Nenhuma pessoa registrada."
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

export default PeopleConsultPage;
