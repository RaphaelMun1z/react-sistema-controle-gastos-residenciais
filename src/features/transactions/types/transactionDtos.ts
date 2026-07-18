import type {
	CreateTransactionInput,
	Transaction,
	TransactionFilters,
	UpdateTransactionInput,
} from "./transaction";

export interface TransactionResponseDTO {
	id: number;
	personId: number;
	personName: string;
	description: string;
	category: string;
	type: "income" | "expense";
	value: number;
	date: string;
	observation?: string;
}

export type CreateTransactionRequestDTO = CreateTransactionInput;
export type UpdateTransactionRequestDTO = UpdateTransactionInput;
export type TransactionFiltersRequestDTO = TransactionFilters;

export const mapTransactionResponseToTransaction = (
	transaction: TransactionResponseDTO,
): Transaction => ({
	id: transaction.id,
	personId: transaction.personId,
	personName: transaction.personName,
	description: transaction.description,
	category: transaction.category,
	type: transaction.type,
	value: transaction.value,
	date: transaction.date,
	observation: transaction.observation,
});
