import "./TransactionsConsultPage.scss";

// Componentes
import PageHeader from "../../../../components/PageHeader/PageHeader";
import Table, {
	type TableAction,
	type TableColumn,
} from "../../../../components/Table/Table";

// Componentes do Material UI
import { Button } from "@mui/material";

// Ícones
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// React Router
import { Link } from "react-router";

// Interfaces
interface Transaction {
	id: number;
	person: string;
	description: string;
	category: string;
	type: "Entrada" | "Saída";
	value: number;
	date: string;
}

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
	},
];

// Dados temporários
const transactions: Transaction[] = [
	{
		id: 1,
		person: "Raphael Muniz",
		description: "Conta de energia",
		category: "Moradia",
		type: "Saída",
		value: 180.5,
		date: "18/07/2026",
	},
	{
		id: 2,
		person: "João Silva",
		description: "Compra supermercado",
		category: "Alimentação",
		type: "Saída",
		value: 320.75,
		date: "17/07/2026",
	},
	{
		id: 3,
		person: "Raphael Muniz",
		description: "Pagamento recebido",
		category: "Renda",
		type: "Entrada",
		value: 1500,
		date: "15/07/2026",
	},
];

// Ações disponíveis na tabela de transações
const actions: TableAction<Transaction>[] = [
	{
		label: "Excluir",
		icon: <DeleteIcon />,
		color: "error",
		onClick: (transaction) => {
			console.log("Excluir:", transaction);
		},
	},
];

const TransactionsConsultPage = () => {
	return (
		<section className="section-container">
			<PageHeader data={TransactionsConsultHeaderData} />

			<div className="create-btn-container">
				<Button
					component={Link}
					to="/transacoes/registrar"
					variant="outlined"
					startIcon={<AddIcon />}
				>
					Registrar transação
				</Button>
			</div>

			<div className="table-container">
				<Table
					columns={columns}
					rows={transactions}
					getRowId={(transaction) => transaction.id}
					actions={actions}
				/>
			</div>
		</section>
	);
};

export default TransactionsConsultPage;
