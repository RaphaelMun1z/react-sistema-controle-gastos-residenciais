import { describe, expect, it } from "vitest";
import { transactionSchema } from "./transactionSchema";

describe("transactionSchema", () => {
	it("aceita uma transação válida", () => {
		const result = transactionSchema.safeParse({
			personId: 1,
			type: "expense",
			description: "Energia",
			value: 120,
			category: "Moradia",
			date: "2026-07-18",
			observation: "",
		});

		expect(result.success).toBe(true);
	});

	it("rejeita valor negativo", () => {
		const result = transactionSchema.safeParse({
			personId: 1,
			type: "expense",
			description: "Energia",
			value: -120,
			category: "Moradia",
			date: "2026-07-18",
		});

		expect(result.success).toBe(false);
	});
});
