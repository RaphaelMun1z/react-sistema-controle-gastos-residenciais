import { createContext } from "react";
import type {
	SignInCredentials,
	SignUpData,
} from "../types/auth";

export interface AuthContextValue {
	isLoading: boolean;
	sessionExpiresAt: string | null;
	sessionMessage: string;
	isAuthenticated: boolean;
	signIn: (credentials: SignInCredentials) => Promise<void>;
	signUp: (data: SignUpData) => Promise<void>;
	signOut: (message?: string) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
