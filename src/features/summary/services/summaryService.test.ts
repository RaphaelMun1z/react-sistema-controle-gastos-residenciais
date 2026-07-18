import { describe, expect, it } from "vitest";
import { summaryService } from "./summaryService";

describe("summaryService", () => {
	it("filtra resumo por pessoa e período", async () => {
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
