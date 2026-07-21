import { z } from "zod";

import { TransactionType } from "../types/transaction";

export const transactionSchema = z.object({
	personId: z.uuid("Selecione uma pessoa."),
	type: z.union([z.literal(TransactionType.Expense), z.literal(TransactionType.Revenue)], {
		message: "Selecione o tipo da transação.",
	}),
	description: z.string().min(1, "Informe uma descrição."),
	amount: z.number().positive("Informe um valor maior que zero."),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
