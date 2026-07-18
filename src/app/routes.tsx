/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { ROUTES } from "./routes/paths";

// Componentes Template
import Template from "../shared/components/layout/Template/Template";
import AuthTemplate from "../shared/components/layout/AuthTemplate/AuthTemplate";
import PrivateRoute from "../features/authentication/components/PrivateRoute";
import PublicRoute from "../features/authentication/components/PublicRoute";

// Páginas/componentes - Autenticação
const SignIn = lazy(
	() => import("../features/authentication/pages/SignIn/SignIn"),
);
const SignUp = lazy(
	() => import("../features/authentication/pages/SignUp/SignUp"),
);
const PeopleConsultPage = lazy(
	() => import("../features/people/pages/PeopleConsultPage/PeopleConsultPage"),
);
const PersonRegisterPage = lazy(
	() =>
		import("../features/people/pages/PersonRegisterPage/PersonRegisterPage"),
);
const TransactionRegisterPage = lazy(
	() =>
		import(
			"../features/transactions/pages/TransactionRegisterPage/TransactionRegisterPage"
		),
);
const TransactionsConsultPage = lazy(
	() =>
		import(
			"../features/transactions/pages/TransactionsConsultPage/TransactionsConsultPage"
		),
);
const SummaryPage = lazy(
	() => import("../features/summary/pages/SummaryPage"),
);
const NotFoundPage = lazy(
	() => import("../features/not-found/pages/NotFoundPage/NotFoundPage"),
);

const withSuspense = (element: ReactNode) => (
	<Suspense fallback={<div role="status">Carregando...</div>}>{element}</Suspense>
);

export const router = createBrowserRouter([
	{
		element: <PublicRoute />,
		children: [
			{
				element: <AuthTemplate />,
				children: [
					{
						path: ROUTES.signIn,
						element: withSuspense(<SignIn />),
					},
					{
						path: ROUTES.signUp,
						element: withSuspense(<SignUp />),
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
						element: withSuspense(<PeopleConsultPage />),
					},
					{
						path: ROUTES.personRegister,
						element: withSuspense(<PersonRegisterPage />),
					},
					{
						path: ROUTES.transactions,
						element: withSuspense(<TransactionsConsultPage />),
					},
					{
						path: ROUTES.transactionRegister,
						element: withSuspense(<TransactionRegisterPage />),
					},
					{
						path: ROUTES.summary,
						element: withSuspense(<SummaryPage />),
					},
				],
			},
		],
	},
	{
		path: "*",
		element: withSuspense(<NotFoundPage />),
	},
]);
