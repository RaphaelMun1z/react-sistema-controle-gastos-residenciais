import { peopleService } from "../../people/services/peopleService";
import { transactionsService } from "../../transactions/services/transactionsService";
import { TransactionType } from "../../transactions/types/transaction";
import type { PersonSummary, SummaryFilters } from "../types/summary";

export const summaryService = {
	async getSummary(filters: SummaryFilters): Promise<PersonSummary[]> {
		const [people, transactions] = await Promise.all([
			peopleService.getAllPeople(),
			transactionsService.getAllTransactions(),
		]);
		const peopleById = new Map(people.map((person) => [person.id, person]));
		const summariesByPerson = new Map<string, PersonSummary>();

		for (const transaction of transactions) {
			if (filters.personId !== "all" && transaction.personId !== filters.personId) {
				continue;
			}

			const person = peopleById.get(transaction.personId);
			const summary = summariesByPerson.get(transaction.personId) ?? {
				personId: transaction.personId,
				personName: person?.name ?? transaction.personId,
				income: 0,
				expenses: 0,
			};

			if (transaction.type === TransactionType.Revenue) {
				summary.income += transaction.amount;
			} else {
				summary.expenses += transaction.amount;
			}

			summariesByPerson.set(transaction.personId, summary);
		}

		return Array.from(summariesByPerson.values());
	},
};
