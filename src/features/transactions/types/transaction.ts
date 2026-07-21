export const TransactionType = {
	Expense: 0,
	Revenue: 1,
} as const;

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
	id: string;
	personId: string;
	description: string;
	type: TransactionType;
	amount: number;
}

export interface CreateTransactionInput {
	personId: string;
	type: TransactionType;
	description: string;
	amount: number;
}
