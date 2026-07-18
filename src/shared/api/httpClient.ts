export interface ApiError {
	message: string;
	status?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

export const httpClient = {
	async get<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
		return request<TResponse>(path, { ...init, method: "GET" });
	},

	async post<TResponse, TBody>(
		path: string,
		body: TBody,
		init?: RequestInit,
	): Promise<TResponse> {
		return request<TResponse>(path, {
			...init,
			method: "POST",
			body: JSON.stringify(body),
		});
	},

	async delete<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
		return request<TResponse>(path, { ...init, method: "DELETE" });
	},
};

const request = async <TResponse>(
	path: string,
	init: RequestInit,
): Promise<TResponse> => {
	const response = await fetch(buildUrl(path), {
		headers: {
			"Content-Type": "application/json",
			...init.headers,
		},
		credentials: "include",
		...init,
	});

	if (!response.ok) {
		throw {
			message: "Não foi possível concluir a operação.",
			status: response.status,
		} satisfies ApiError;
	}

	return response.json() as Promise<TResponse>;
};
