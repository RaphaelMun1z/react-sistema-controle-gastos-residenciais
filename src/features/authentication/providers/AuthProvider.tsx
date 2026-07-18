import {
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { authenticationService } from "../services/authenticationService";
import type { AuthSession, SignInCredentials, SignUpData } from "../types/auth";
import { AuthContext, type AuthContextValue } from "../contexts/AuthContext";

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [session, setSession] = useState<AuthSession | null>(() =>
		authenticationService.getStoredSession(),
	);

	const signIn = useCallback(async (credentials: SignInCredentials) => {
		const nextSession = await authenticationService.signIn(credentials);
		setSession(nextSession);
	}, []);

	const signUp = useCallback(async (data: SignUpData) => {
		const nextSession = await authenticationService.signUp(data);
		setSession(nextSession);
	}, []);

	const signOut = useCallback(async () => {
		await authenticationService.signOut();
		setSession(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user: session?.user ?? null,
			isAuthenticated: Boolean(session?.user),
			signIn,
			signUp,
			signOut,
		}),
		[session?.user, signIn, signOut, signUp],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
