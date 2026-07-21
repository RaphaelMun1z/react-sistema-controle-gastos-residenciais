import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import type { PagedResponse, PaginationParams, Resource } from "../../../shared/api/apiTypes";
import { httpClient } from "../../../shared/api/httpClient";
import type { CreatePersonInput, Person } from "../types/person";
import type {
	CreatePersonRequestDTO,
	PersonResponseDTO,
} from "../types/personDtos";
import { mapPersonResponseToPerson } from "../types/personDtos";

const DEFAULT_PAGE_SIZE_FOR_OPTIONS = 100;

export const peopleService = {
	async getPeople(params: PaginationParams): Promise<PagedResponse<Person>> {
		const response = await httpClient.get<PagedResponse<PersonResponseDTO>>(
			API_ENDPOINTS.people,
			{ params: { page: params.page, pageSize: params.pageSize } },
		);

		return {
			...response,
			content: response.content.map(mapPersonResponseToPerson),
		};
	},

	async getAllPeople(): Promise<Person[]> {
		const firstPage = await this.getPeople({
			page: 1,
			pageSize: DEFAULT_PAGE_SIZE_FOR_OPTIONS,
		});
		const people = [...firstPage.content];

		for (let page = 2; page <= firstPage.totalPages; page += 1) {
			const nextPage = await this.getPeople({
				page,
				pageSize: DEFAULT_PAGE_SIZE_FOR_OPTIONS,
			});
			people.push(...nextPage.content);
		}

		return people;
	},

	async getPersonById(id: string): Promise<Person> {
		const resource = await httpClient.get<Resource<PersonResponseDTO>>(
			API_ENDPOINTS.personById(id),
		);

		return mapPersonResponseToPerson(resource.data);
	},

	async createPerson(input: CreatePersonInput): Promise<Person> {
		const resource = await httpClient.post<
			Resource<PersonResponseDTO>,
			CreatePersonRequestDTO
		>(API_ENDPOINTS.people, input);

		return mapPersonResponseToPerson(resource.data);
	},

	async deletePerson(id: string): Promise<void> {
		await httpClient.delete<void>(API_ENDPOINTS.personById(id));
	},
};
