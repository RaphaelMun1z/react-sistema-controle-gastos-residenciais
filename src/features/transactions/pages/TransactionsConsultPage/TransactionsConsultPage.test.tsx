import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import TransactionsConsultPage from "./TransactionsConsultPage";

const transaction = {
	id: 1,
	personId: 1,
	personName: "Maria Souza",
	description: "Salario",
	category: "Outros",
	type: "income",
	value: 1500,
	date: "2026-07-18",
};

describe("TransactionsConsultPage", () => {
	it("exibe loading e renderiza transacoes retornadas pela API", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.transactions}`, async () => {
				await new Promise((resolve) => globalThis.setTimeout(resolve, 100));

				return HttpResponse.json([transaction]);
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
			http.get(`*${API_ENDPOINTS.transactions}`, () => HttpResponse.json([])),
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
			.mockImplementationOnce(() => HttpResponse.json([transaction]));

		server.use(http.get(`*${API_ENDPOINTS.transactions}`, transactionsHandler));

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
