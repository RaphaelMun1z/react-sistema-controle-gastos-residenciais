import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import { TransactionType } from "../../types/transaction";
import TransactionsConsultPage from "./TransactionsConsultPage";

const personId = "11111111-1111-4111-8111-111111111111";

const transaction = {
	id: "22222222-2222-4222-8222-222222222222",
	personId,
	description: "Salario",
	type: TransactionType.Revenue,
	amount: 1500,
};

const pagedTransactions = {
	content: [transaction],
	page: 1,
	pageSize: 10,
	totalElements: 1,
	totalPages: 1,
};

const pagedPeople = {
	content: [
		{
			id: personId,
			name: "Maria Souza",
			birthDate: "1994-07-18",
			age: 32,
		},
	],
	page: 1,
	pageSize: 100,
	totalElements: 1,
	totalPages: 1,
};

describe("TransactionsConsultPage", () => {
	it("exibe loading e renderiza transacoes retornadas pela API", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json(pagedPeople)),
			http.get(`*${API_ENDPOINTS.transactions}`, async () => {
				await new Promise((resolve) => globalThis.setTimeout(resolve, 100));

				return HttpResponse.json(pagedTransactions);
			}),
		);

		renderWithProviders(<TransactionsConsultPage />);

		expect(
			screen.getByRole("status", { name: "Carregando dados" }),
		).toBeInTheDocument();
		expect(await screen.findByText("Maria Souza")).toBeInTheDocument();
		expect(screen.getByText("Salario")).toBeInTheDocument();
		expect(screen.getByText("Receita")).toBeInTheDocument();
		expect(screen.getByText(/R\$\s*1.500,00/)).toBeInTheDocument();
	});

	it("renderiza estado vazio quando a API retorna lista vazia", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json(pagedPeople)),
			http.get(`*${API_ENDPOINTS.transactions}`, () =>
				HttpResponse.json({
					content: [],
					page: 1,
					pageSize: 10,
					totalElements: 0,
					totalPages: 0,
				}),
			),
		);

		renderWithProviders(<TransactionsConsultPage />);

		expect(
			await screen.findByText("Nenhuma transação encontrada."),
		).toBeInTheDocument();
	});

	it("exibe erro e permite tentar novamente", async () => {
		const transactionsHandler = vi
			.fn()
			.mockImplementationOnce(() => HttpResponse.error())
			.mockImplementationOnce(() => HttpResponse.json(pagedTransactions));

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json(pagedPeople)),
			http.get(`*${API_ENDPOINTS.transactions}`, transactionsHandler),
		);

		renderWithProviders(<TransactionsConsultPage />);

		expect(
			await screen.findByText("Não foi possível carregar suas transações."),
		).toBeInTheDocument();

		await userEvent.click(
			screen.getByRole("button", { name: "Tentar novamente" }),
		);

		await waitFor(() => {
			expect(transactionsHandler).toHaveBeenCalledTimes(2);
		});
		expect(await screen.findByText("Maria Souza")).toBeInTheDocument();
	});
});
