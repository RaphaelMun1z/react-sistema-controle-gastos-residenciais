import type { TransactionType } from "../types/transaction";

export const transactionTypeLabels: Record<TransactionType, string> = {
	income: "Entrada",
	expense: "Saída",
};
