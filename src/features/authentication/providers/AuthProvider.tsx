import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { env } from "../../../shared/config/env";
import { authenticationService } from "../services/authenticationService";
import type { SignInCredentials, SignUpData } from "../types/auth";
import { AuthContext, type AuthContextValue } from "../contexts/AuthContext";
import { authTokenStorage } from "../../../shared/api/authTokenStorage";
import { setUnauthorizedHandler } from "../../../shared/api/httpClient";

interface AuthProviderProps {
	children: ReactNode;
}

interface AuthState {
	sessionExpiresAt: string | null;
	sessionMessage: string;
}

const getInitialAuthState = (): AuthState => {
	if (env.bypassAuth) {
		return {
			sessionExpiresAt: null,
			sessionMessage: "",
		};
	}

	const storedToken = authTokenStorage.get();

	if (!storedToken) {
		return {
			sessionExpiresAt: null,
			sessionMessage: "",
		};
	}

	if (authTokenStorage.isExpired(storedToken)) {
		authTokenStorage.clear();

		return {
			sessionExpiresAt: null,
			sessionMessage: "Sua sessão expirou. Entre novamente para continuar.",
		};
	}

	return {
		sessionExpiresAt: storedToken.expiresAt,
		sessionMessage: "",
	};
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [authState, setAuthState] = useState(getInitialAuthState);

	const signOut = useCallback((message = "") => {
		authTokenStorage.clear();
		setAuthState({
			sessionExpiresAt: null,
			sessionMessage: message,
		});
	}, []);

	useEffect(() => {
		setUnauthorizedHandler(() => {
			signOut("Sua sessão expirou. Entre novamente para continuar.");
		});

		return () => {
			setUnauthorizedHandler(null);
		};
	}, [signOut]);

	const signIn = useCallback(async (credentials: SignInCredentials) => {
		const nextSession = await authenticationService.signIn(credentials);
		authTokenStorage.set(nextSession);
		setAuthState({
			sessionExpiresAt: nextSession.expiresAt,
			sessionMessage: "",
		});
	}, []);

	const signUp = useCallback(async (data: SignUpData) => {
		await authenticationService.signUp(data);
		setAuthState((currentState) => ({
			...currentState,
			sessionMessage: "Conta criada com sucesso. Entre para continuar.",
		}));
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			isLoading: false,
			sessionExpiresAt: authState.sessionExpiresAt,
			sessionMessage: authState.sessionMessage,
			isAuthenticated: Boolean(authState.sessionExpiresAt) || env.bypassAuth,
			signIn,
			signUp,
			signOut,
		}),
		[authState, signIn, signOut, signUp],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
