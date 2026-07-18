import { z } from "zod";

export const personSchema = z.object({
	name: z.string().min(1, "Informe o nome."),
	email: z.email("Informe um e-mail válido."),
	age: z
		.number("Informe a idade.")
		.int("A idade deve ser um número inteiro.")
		.min(1, "A idade deve ser maior que zero.")
		.max(120, "Informe uma idade válida."),
});

export type PersonFormData = z.infer<typeof personSchema>;
