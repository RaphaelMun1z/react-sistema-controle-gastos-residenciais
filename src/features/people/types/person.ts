export interface Person {
	id: number;
	name: string;
	age: number;
	// E-mail fica no cadastro de pessoa porque também será usado como credencial de autenticação.
	email: string;
}

export interface CreatePersonInput {
	name: string;
	email: string;
	age: number;
}

export type UpdatePersonInput = Partial<CreatePersonInput>;
