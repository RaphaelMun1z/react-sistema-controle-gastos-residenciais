import type { CreatePersonInput, Person, UpdatePersonInput } from "./person";

export interface PersonResponseDTO {
	id: number;
	name: string;
	email: string;
	age: number;
}

export type CreatePersonRequestDTO = CreatePersonInput;
export type UpdatePersonRequestDTO = UpdatePersonInput;

export const mapPersonResponseToPerson = (
	person: PersonResponseDTO,
): Person => ({
	id: person.id,
	name: person.name,
	email: person.email,
	age: person.age,
});
