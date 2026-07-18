import { describe, expect, it } from "vitest";
import { personSchema } from "./personSchema";

describe("personSchema", () => {
	it("aceita uma pessoa válida", () => {
		const result = personSchema.safeParse({
			name: "Maria",
			email: "maria@email.com",
			age: 32,
		});

		expect(result.success).toBe(true);
	});

	it("rejeita idade inválida", () => {
		const result = personSchema.safeParse({
			name: "Maria",
			email: "maria@email.com",
			age: 0,
		});

		expect(result.success).toBe(false);
	});
});
