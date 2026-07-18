import { createBrowserRouter, Navigate } from "react-router";

// Componentes Template
import Template from "../components/layout/Template/Template";
import AuthTemplate from "../components/layout/AuthTemplate/AuthTemplate";

// Páginas/componentes - Autenticação
import SignIn from "../features/authentication/pages/SignIn/SignIn";
import SignUp from "../features/authentication/pages/SignUp/SignUp";

// Páginas/componentes - Pessoas
import PeopleConsultPage from "../features/people/pages/PeopleConsultPage/PeopleConsultPage";
import PersonRegisterPage from "../features/people/pages/PersonRegisterPage/PersonRegisterPage";

// Páginas/componentes - Transações
import TransactionRegisterPage from "../features/transactions/pages/TransactionRegisterPage/TransactionRegisterPage";
import TransactionsConsultPage from "../features/transactions/pages/TransactionsConsultPage/TransactionsConsultPage";

// Páginas/componentes - Resumo
import SummaryPage from "../features/summary/pages/SummaryPage";

// Página não encontrada
import NotFoundPage from "../features/not-found/pages/NotFoundPage/NotFoundPage";

export const router = createBrowserRouter([
	{
		element: <AuthTemplate />,
		children: [
			{
				path: "/entrar",
				element: <SignIn />,
			},
			{
				path: "/cadastrar",
				element: <SignUp />,
			},
		],
	},
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
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
