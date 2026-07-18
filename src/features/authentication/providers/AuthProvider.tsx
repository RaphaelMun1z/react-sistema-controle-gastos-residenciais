import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { createApiError } from "../../../shared/api/apiError";
import { authenticationService } from "../services/authenticationService";
import type { AuthUser, SignInCredentials, SignUpData } from "../types/auth";
import { AuthContext, type AuthContextValue } from "../contexts/AuthContext";

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthUnavailable, setIsAuthUnavailable] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const loadCurrentUser = async () => {
			try {
				const currentUser = await authenticationService.getCurrentUser();

				if (isMounted) {
					setUser(currentUser);
					setIsAuthUnavailable(false);
				}
			} catch (error) {
				const apiError = createApiError(error);

				if (isMounted) {
					setUser(null);
					setIsAuthUnavailable(
						apiError.type === "network" || apiError.type === "timeout",
					);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void loadCurrentUser();

		return () => {
			isMounted = false;
		};
	}, []);

	const signIn = useCallback(async (credentials: SignInCredentials) => {
		const nextSession = await authenticationService.signIn(credentials);
		setUser(nextSession.user);
		setIsAuthUnavailable(false);
	}, []);

	const signUp = useCallback(async (data: SignUpData) => {
		const nextSession = await authenticationService.signUp(data);
		setUser(nextSession.user);
		setIsAuthUnavailable(false);
	}, []);

	const signOut = useCallback(async () => {
		await authenticationService.signOut();
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isLoading,
			isAuthUnavailable,
			isAuthenticated: Boolean(user),
			signIn,
			signUp,
			signOut,
		}),
		[isAuthUnavailable, isLoading, signIn, signOut, signUp, user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
