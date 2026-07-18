import { createBrowserRouter, Navigate } from "react-router";

// Componente Template
import Template from "../components/layout/Template/Template";

// Páginas/componentes - Pessoas
import PeopleConsultPage from "../features/people/pages/PeopleConsultPage/PeopleConsultPage";
import PersonRegisterPage from "../features/people/pages/PersonRegisterPage/PersonRegisterPage";

// Páginas/componentes - Transações
import TransactionRegisterPage from "../features/transactions/pages/TransactionRegisterPage/TransactionRegisterPage";
import TransactionsConsultPage from "../features/transactions/pages/TransactionsConsultPage/TransactionsConsultPage";

// Páginas/componentes - Resumo
import SummaryPage from "../features/summary/pages/SummaryPage";
import NotFoundPage from "../features/not-found/pages/NotFoundPage/NotFoundPage";

export const router = createBrowserRouter([
	{
		element: <Template />,
		children: [
			{
				path: "/",
				element: <Navigate to="/pessoas" replace />,
			},
			{
				path: "/pessoas",
				element: <PeopleConsultPage />,
			},
			{
				path: "/pessoas/registrar",
				element: <PersonRegisterPage />,
			},
			{
				path: "/transacoes",
				element: <TransactionsConsultPage />,
			},
			{
				path: "/transacoes/registrar",
				element: <TransactionRegisterPage />,
			},
			{
				path: "/summary",
				element: <SummaryPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);
