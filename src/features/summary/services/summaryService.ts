import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type { PersonSummary, SummaryFilters } from "../types/summary";
import type {
	SummaryFiltersRequestDTO,
	SummaryResponseDTO,
} from "../types/summaryDtos";
import { mapSummaryResponseToSummary } from "../types/summaryDtos";

export const summaryService = {
	async getSummary(filters: SummaryFilters): Promise<PersonSummary[]> {
		const params: SummaryFiltersRequestDTO = filters;
		const summary = await httpClient.get<SummaryResponseDTO[]>(
			API_ENDPOINTS.summary,
			{
				params: {
					personId:
						params.personId === "all" ? undefined : params.personId,
					startDate: params.startDate,
					endDate: params.endDate,
				},
			},
		);

		return summary.map(mapSummaryResponseToSummary);
	},
};
