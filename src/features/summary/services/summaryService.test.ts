import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { server } from "../../../test/server";
import { summaryService } from "./summaryService";

describe("summaryService", () => {
	it("filtra resumo por pessoa e período", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.summary}`, ({ request }) => {
				const url = new URL(request.url);

				expect(url.searchParams.get("personId")).toBe("1");
				expect(url.searchParams.get("startDate")).toBe("2026-07-15");
				expect(url.searchParams.get("endDate")).toBe("2026-07-15");

				return HttpResponse.json([
					{
						personId: 1,
						personName: "Raphael Muniz",
						income: 1500,
						expenses: 0,
					},
				]);
			}),
		);

		const summary = await summaryService.getSummary({
			personId: "1",
			startDate: "2026-07-15",
			endDate: "2026-07-15",
		});

		expect(summary).toEqual([
			{
				personId: 1,
				personName: "Raphael Muniz",
				income: 1500,
				expenses: 0,
			},
		]);
	});
});
