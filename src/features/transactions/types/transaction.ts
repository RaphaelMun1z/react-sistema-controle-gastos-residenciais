export type TransactionType = "income" | "expense";

export interface Transaction {
	id: number;
	personId: number;
	personName: string;
	description: string;
	category: string;
	type: TransactionType;
	value: number;
	date: string;
	observation?: string;
}

export interface CreateTransactionInput {
	personId: number;
	type: TransactionType;
	description: string;
	value: number;
	category: string;
	date: string;
	observation?: string;
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>;

export interface TransactionFilters {
	personId?: number;
	type?: TransactionType;
	startDate?: string;
	endDate?: string;
}
