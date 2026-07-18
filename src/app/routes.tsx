/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { ROUTES } from "./routes/paths";
import { ROUTE_TITLES } from "./routes/pageTitles";

// Componentes Template
import Template from "../shared/components/layout/Template/Template";
import AuthTemplate from "../shared/components/layout/AuthTemplate/AuthTemplate";
import PageTitle from "../shared/components/PageTitle/PageTitle";
import PageSkeleton from "../shared/components/skeletons/PageSkeleton";
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
	<Suspense fallback={<PageSkeleton />}>{element}</Suspense>
);

const withPageTitle = (element: ReactNode, title: string) => (
	<PageTitle title={title}>{withSuspense(element)}</PageTitle>
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
						element: withPageTitle(<SignIn />, ROUTE_TITLES[ROUTES.signIn]),
					},
					{
						path: ROUTES.signUp,
						element: withPageTitle(<SignUp />, ROUTE_TITLES[ROUTES.signUp]),
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
						element: (
							<PageTitle title={ROUTE_TITLES[ROUTES.people]}>
								<Navigate to={ROUTES.people} replace />
							</PageTitle>
						),
					},
					{
						path: ROUTES.people,
						element: withPageTitle(
							<PeopleConsultPage />,
							ROUTE_TITLES[ROUTES.people],
						),
					},
					{
						path: ROUTES.personRegister,
						element: withPageTitle(
							<PersonRegisterPage />,
							ROUTE_TITLES[ROUTES.personRegister],
						),
					},
					{
						path: ROUTES.transactions,
						element: withPageTitle(
							<TransactionsConsultPage />,
							ROUTE_TITLES[ROUTES.transactions],
						),
					},
					{
						path: ROUTES.transactionRegister,
						element: withPageTitle(
							<TransactionRegisterPage />,
							ROUTE_TITLES[ROUTES.transactionRegister],
						),
					},
					{
						path: ROUTES.summary,
						element: withPageTitle(
							<SummaryPage />,
							ROUTE_TITLES[ROUTES.summary],
						),
					},
				],
			},
		],
	},
	{
		path: "*",
		element: withPageTitle(<NotFoundPage />, ROUTE_TITLES.notFound),
	},
]);
