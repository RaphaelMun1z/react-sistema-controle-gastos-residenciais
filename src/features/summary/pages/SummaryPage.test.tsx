import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { server } from "../../../test/server";
import { TransactionType } from "../../transactions/types/transaction";
import SummaryPage from "./SummaryPage";

const personId = "11111111-1111-4111-8111-111111111111";

const pagedPeople = {
	content: [
		{
			id: personId,
			name: "Raphael Muniz",
			birthDate: "2001-07-18",
			age: 25,
		},
	],
	page: 1,
	pageSize: 100,
	totalElements: 1,
	totalPages: 1,
};

const setupHandlers = () => {
	server.use(
		http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json(pagedPeople)),
		http.get(`*${API_ENDPOINTS.transactions}`, () =>
			HttpResponse.json({
				content: [
					{
						id: "22222222-2222-4222-8222-222222222222",
						personId,
						amount: 1500,
						type: TransactionType.Revenue,
						description: "Salário",
					},
					{
						id: "33333333-3333-4333-8333-333333333333",
						personId,
						amount: 300,
						type: TransactionType.Expense,
						description: "Mercado",
					},
				],
				page: 1,
				pageSize: 100,
				totalElements: 2,
				totalPages: 1,
			}),
		),
	);
};

describe("SummaryPage", () => {
	it("deriva resumo financeiro usando pessoas e todas as transações paginadas", async () => {
		setupHandlers();

		renderWithProviders(<SummaryPage />);

		expect(
			await screen.findByRole("heading", { name: "Raphael Muniz" }),
		).toBeInTheDocument();
		expect(screen.getAllByText(/R\$\s*1.500,00/)[0]).toBeInTheDocument();
		expect(screen.getAllByText(/R\$\s*300,00/)[0]).toBeInTheDocument();
	});

	it("não renderiza a ação de análise removida", async () => {
		setupHandlers();

		renderWithProviders(<SummaryPage />);

		await screen.findByRole("heading", { name: "Raphael Muniz" });
		const removedActionName = ["Analisar", "transações"].join(" ");
		expect(
			screen.queryByRole("button", { name: new RegExp(removedActionName, "i") }),
		).not.toBeInTheDocument();
	});
});
