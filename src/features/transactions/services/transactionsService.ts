import type {
	CreateTransactionInput,
	Transaction,
} from "../types/transaction";

let transactions: Transaction[] = [
	{
		id: 1,
		personId: 1,
		personName: "Raphael Muniz",
		description: "Conta de energia",
		category: "Moradia",
		type: "expense",
		value: 180.5,
		date: "2026-07-18",
	},
	{
		id: 2,
		personId: 2,
		personName: "João Silva",
		description: "Compra supermercado",
		category: "Alimentação",
		type: "expense",
		value: 320.75,
		date: "2026-07-17",
	},
	{
		id: 3,
		personId: 1,
		personName: "Raphael Muniz",
		description: "Pagamento recebido",
		category: "Renda",
		type: "income",
		value: 1500,
		date: "2026-07-15",
	},
];

export const transactionsService = {
	async list(): Promise<Transaction[]> {
		return transactions;
	},

	async create(input: CreateTransactionInput): Promise<Transaction> {
		const personNameById: Record<number, string> = {
			1: "Raphael Muniz",
			2: "João Silva",
		};

		const transaction = {
			id: Date.now(),
			personName: personNameById[input.personId] ?? "Pessoa",
			...input,
		};

		transactions = [...transactions, transaction];
		return transaction;
	},

	async remove(id: number): Promise<void> {
		transactions = transactions.filter((transaction) => transaction.id !== id);
	},
};
