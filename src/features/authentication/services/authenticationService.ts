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
		>(API_ENDPOINTS.auth.login, credentials);

		return mapSessionResponseToSession(session);
	},

	async signUp(data: SignUpData): Promise<AuthUser> {
		const request: SignUpRequestDTO = {
			name: data.name,
			birthDate: data.birthDate,
			email: data.email,
			password: data.password,
		};
		const user = await httpClient.post<
			AuthUserResponseDTO,
			SignUpRequestDTO
		>(API_ENDPOINTS.auth.register, request);

		return mapUserResponseToUser(user);
	},
};
