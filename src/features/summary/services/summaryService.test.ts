import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { server } from "../../../test/server";
import { TransactionType } from "../../transactions/types/transaction";
import { summaryService } from "./summaryService";

const personId = "11111111-1111-4111-8111-111111111111";

describe("summaryService", () => {
	it("agrega resumo a partir de todas as páginas reais de pessoas e transações", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json({
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
				}),
			),
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
							amount: 200,
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

		const summary = await summaryService.getSummary({
			personId,
			startDate: "",
			endDate: "",
		});

		expect(summary).toEqual([
			{
				personId,
				personName: "Raphael Muniz",
				income: 1500,
				expenses: 200,
			},
		]);
	});
});
