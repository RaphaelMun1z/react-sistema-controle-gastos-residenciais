import type {
	AuthSession,
	AuthUser,
	SignInCredentials,
	SignUpData,
} from "./auth";

export type SignInRequestDTO = SignInCredentials;
export type SignUpRequestDTO = Omit<SignUpData, "confirmPassword">;

export interface AuthUserResponseDTO {
	id: string;
	name: string;
	email: string;
}

export interface AuthSessionResponseDTO {
	user: AuthUserResponseDTO;
}

export const mapUserResponseToUser = (
	user: AuthUserResponseDTO,
): AuthUser => ({
	id: user.id,
	name: user.name,
	email: user.email,
});

export const mapSessionResponseToSession = (
	session: AuthSessionResponseDTO,
): AuthSession => ({
	user: mapUserResponseToUser(session.user),
});
