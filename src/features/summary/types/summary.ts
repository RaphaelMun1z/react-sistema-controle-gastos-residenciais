export interface PersonSummary {
	personId: string;
	personName: string;
	income: number;
	expenses: number;
}

export interface SummaryFilters {
	personId: string;
	startDate: string;
	endDate: string;
}
