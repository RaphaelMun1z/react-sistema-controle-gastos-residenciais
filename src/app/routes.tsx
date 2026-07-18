import { createBrowserRouter, Navigate } from "react-router";
import { ROUTES } from "./routes/paths";

// Componentes Template
import Template from "../shared/components/layout/Template/Template";
import AuthTemplate from "../shared/components/layout/AuthTemplate/AuthTemplate";
import PrivateRoute from "../features/authentication/components/PrivateRoute";
import PublicRoute from "../features/authentication/components/PublicRoute";

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
		element: <PublicRoute />,
		children: [
			{
				element: <AuthTemplate />,
				children: [
					{
						path: ROUTES.signIn,
						element: <SignIn />,
					},
					{
						path: ROUTES.signUp,
						element: <SignUp />,
					},
				],
			},
		],
	},
	{
		element: <PrivateRoute />,
		children: [
			{
				element: <Template />,
				children: [
					{
						path: ROUTES.root,
						element: <Navigate to={ROUTES.people} replace />,
					},
					{
						path: ROUTES.people,
						element: <PeopleConsultPage />,
					},
					{
						path: ROUTES.personRegister,
						element: <PersonRegisterPage />,
					},
					{
						path: ROUTES.transactions,
						element: <TransactionsConsultPage />,
					},
					{
						path: ROUTES.transactionRegister,
						element: <TransactionRegisterPage />,
					},
					{
						path: ROUTES.summary,
						element: <SummaryPage />,
					},
				],
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
