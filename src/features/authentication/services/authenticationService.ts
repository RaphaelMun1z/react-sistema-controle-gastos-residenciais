import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type {
	AuthSession,
	AuthUser,
	SignInCredentials,
	SignUpData,
} from "../types/auth";
import type {
	AuthSessionResponseDTO,
	AuthUserResponseDTO,
	SignInRequestDTO,
	SignUpRequestDTO,
} from "../types/authDtos";
import {
	mapSessionResponseToSession,
	mapUserResponseToUser,
} from "../types/authDtos";

export const authenticationService = {
	async signIn(credentials: SignInCredentials): Promise<AuthSession> {
		const session = await httpClient.post<
			AuthSessionResponseDTO,
			SignInRequestDTO
		>(API_ENDPOINTS.auth.signIn, credentials);

		return mapSessionResponseToSession(session);
	},

	async signUp(data: SignUpData): Promise<AuthSession> {
		const request: SignUpRequestDTO = {
			name: data.name,
			email: data.email,
			password: data.password,
		};
		const session = await httpClient.post<
			AuthSessionResponseDTO,
			SignUpRequestDTO
		>(API_ENDPOINTS.auth.signUp, request);

		return mapSessionResponseToSession(session);
	},

	async signOut(): Promise<void> {
		await httpClient.post<void, Record<string, never>>(
			API_ENDPOINTS.auth.signOut,
			{},
		);
	},

	async getCurrentUser(): Promise<AuthUser> {
		const user = await httpClient.get<AuthUserResponseDTO>(
			API_ENDPOINTS.auth.currentUser,
		);

		return mapUserResponseToUser(user);
	},
};
