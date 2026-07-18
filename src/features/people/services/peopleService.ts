import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type { CreatePersonInput, Person, UpdatePersonInput } from "../types/person";
import type {
	CreatePersonRequestDTO,
	PersonResponseDTO,
	UpdatePersonRequestDTO,
} from "../types/personDtos";
import { mapPersonResponseToPerson } from "../types/personDtos";

export const peopleService = {
	async getPeople(): Promise<Person[]> {
		const people = await httpClient.get<PersonResponseDTO[]>(
			API_ENDPOINTS.people,
		);

		return people.map(mapPersonResponseToPerson);
	},

	async getPersonById(id: number): Promise<Person> {
		const person = await httpClient.get<PersonResponseDTO>(
			API_ENDPOINTS.personById(id),
		);

		return mapPersonResponseToPerson(person);
	},

	async createPerson(input: CreatePersonInput): Promise<Person> {
		const person = await httpClient.post<
			PersonResponseDTO,
			CreatePersonRequestDTO
		>(API_ENDPOINTS.people, input);

		return mapPersonResponseToPerson(person);
	},

	async updatePerson(id: number, input: UpdatePersonInput): Promise<Person> {
		const person = await httpClient.put<
			PersonResponseDTO,
			UpdatePersonRequestDTO
		>(API_ENDPOINTS.personById(id), input);

		return mapPersonResponseToPerson(person);
	},

	async deletePerson(id: number): Promise<void> {
		await httpClient.delete<void>(API_ENDPOINTS.personById(id));
	},
};
