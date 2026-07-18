import type { CreatePersonInput, Person } from "../types/person";

let people: Person[] = [
	{
		id: 1,
		name: "Raphael Muniz",
		age: 25,
		email: "raphael@email.com",
	},
	{
		id: 2,
		name: "João Silva",
		age: 30,
		email: "joao@email.com",
	},
];

export const peopleService = {
	async list(): Promise<Person[]> {
		return people;
	},

	async create(input: CreatePersonInput): Promise<Person> {
		const person = {
			id: Date.now(),
			...input,
		};

		people = [...people, person];
		return person;
	},

	async remove(id: number): Promise<void> {
		people = people.filter((person) => person.id !== id);
	},
};
