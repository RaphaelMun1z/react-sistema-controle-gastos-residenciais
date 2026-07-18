import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { summaryService } from "../services/summaryService";
import type { SummaryFilters } from "../types/summary";

export const useSummary = (filters: SummaryFilters) =>
	useQuery({
		queryKey: ["summary", filters],
		queryFn: () => summaryService.getSummary(filters),
		placeholderData: keepPreviousData,
	});
