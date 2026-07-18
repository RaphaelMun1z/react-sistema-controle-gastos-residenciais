import { z } from "zod";

export const transactionSchema = z.object({
	personId: z.number().min(1, "Selecione uma pessoa."),
	type: z.enum(["income", "expense"], {
		message: "Selecione o tipo da transação.",
	}),
	description: z.string().min(1, "Informe uma descrição."),
	value: z.number().positive("Informe um valor maior que zero."),
	category: z.string().min(1, "Selecione uma categoria."),
	date: z.string().min(1, "Informe a data."),
	observation: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
