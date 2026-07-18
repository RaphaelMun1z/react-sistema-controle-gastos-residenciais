import { createContext } from "react";
import type {
	AuthUser,
	SignInCredentials,
	SignUpData,
} from "../types/auth";

export interface AuthContextValue {
	user: AuthUser | null;
	isAuthenticated: boolean;
	signIn: (credentials: SignInCredentials) => Promise<void>;
	signUp: (data: SignUpData) => Promise<void>;
	signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
