import type {
	AuthSession,
	SignInCredentials,
	SignUpData,
} from "../types/auth";

const STORAGE_KEY = "residential-expenses-session";

const createMockSession = (name: string, email: string): AuthSession => ({
	user: {
		id: crypto.randomUUID(),
		name,
		email,
	},
});

export const authenticationService = {
	getStoredSession(): AuthSession | null {
		const rawSession = window.sessionStorage.getItem(STORAGE_KEY);

		if (!rawSession) {
			return null;
		}

		try {
			return JSON.parse(rawSession) as AuthSession;
		} catch {
			window.sessionStorage.removeItem(STORAGE_KEY);
			return null;
		}
	},

	storeSession(session: AuthSession) {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
	},

	clearSession() {
		window.sessionStorage.removeItem(STORAGE_KEY);
	},

	async signIn(credentials: SignInCredentials): Promise<AuthSession> {
		const session = createMockSession(
			credentials.email.split("@")[0] || "Usuário",
			credentials.email,
		);

		this.storeSession(session);
		return session;
	},

	async signUp(data: SignUpData): Promise<AuthSession> {
		const session = createMockSession(data.name, data.email);

		this.storeSession(session);
		return session;
	},

	async signOut() {
		this.clearSession();
	},
};
