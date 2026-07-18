export const env = {
	apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
	// Bypass temporario apenas para desenvolvimento enquanto a API de autenticacao nao estiver pronta.
	bypassAuth: import.meta.env.VITE_BYPASS_AUTH === "true",
};
