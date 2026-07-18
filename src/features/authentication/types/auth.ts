export interface AuthUser {
	id: string;
	name: string;
	email: string;
}

export interface SignInCredentials {
	email: string;
	password: string;
}

export interface SignUpData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AuthSession {
	user: AuthUser;
}
