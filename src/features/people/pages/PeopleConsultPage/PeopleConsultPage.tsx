import "./PeopleConsultPage.scss";

// Ícones do Material Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Componentes do Material UI
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../components/Table/Table";
import { Button } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

// React Router
import { Link } from "react-router";

// Componentes Locais
import PageHeader from "../../../../components/PageHeader/PageHeader";

// Interfaces
interface Person {
	id: number;
	name: string;
	age: number;
	email: string;
}

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

// Dados temporários
const people: Person[] = [
	{
		id: 1,
		name: "Raphael Muniz",
		age: 25,
		email: "raphael@email.com",
	},
	{
		id: 2,
		name: "João Silva",
		age: 30,
		email: "joao@email.com",
	},
];

// Ações disponíveis na tabela de pessoas
const actions: TableAction<Person>[] = [
	{
		label: "Excluir",
		icon: <DeleteIcon />,
		color: "error",
		onClick: (person) => {
			console.log("Excluir:", person);
		},
	},
];

const PeopleConsultHeaderData = {
	sector: "Pessoas",
	sectorPath: "/pessoas",
	currentPage: "Consultar",
	title: "Pessoas Registradas",
};

const PeopleConsultPage = () => {
	return (
		<section className="section-container">
			<PageHeader data={PeopleConsultHeaderData} />

			<div className="create-btn-container">
				<Button
					component={Link}
					variant="outlined"
					to="/pessoas/registrar"
					startIcon={<PersonAdd />}
				>
					Registrar pessoa
				</Button>
			</div>

			<div className="table-container">
				<Table
					columns={columns}
					rows={people}
					getRowId={(person) => person.id}
					actions={actions}
				/>
			</div>
		</section>
	);
};

export default PeopleConsultPage;
