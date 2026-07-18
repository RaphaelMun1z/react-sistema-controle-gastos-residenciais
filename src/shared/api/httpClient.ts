import { env } from "../config/env";
import { createApiError, createHttpError } from "./apiError";

const API_BASE_URL = env.apiUrl;
const DEFAULT_TIMEOUT_IN_MS = 10000;

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const buildQueryString = (params?: Record<string, string | number | undefined>) => {
	if (!params) {
		return "";
	}

	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			searchParams.set(key, String(value));
		}
	});

	const queryString = searchParams.toString();

	return queryString ? `?${queryString}` : "";
};

interface HttpRequestOptions extends RequestInit {
	params?: Record<string, string | number | undefined>;
	timeoutInMs?: number;
}

export const httpClient = {
	async get<TResponse>(
		path: string,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, { ...init, method: "GET" });
	},

	async post<TResponse, TBody>(
		path: string,
		body: TBody,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, {
			...init,
			method: "POST",
			body: JSON.stringify(body),
		});
	},

	async put<TResponse, TBody>(
		path: string,
		body: TBody,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, {
			...init,
			method: "PUT",
			body: JSON.stringify(body),
		});
	},

	async delete<TResponse>(
		path: string,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, { ...init, method: "DELETE" });
	},
};

const request = async <TResponse>(
	path: string,
	init: HttpRequestOptions,
): Promise<TResponse> => {
	const controller = new AbortController();
	const timeout = globalThis.setTimeout(
		() => controller.abort(),
		init.timeoutInMs ?? DEFAULT_TIMEOUT_IN_MS,
	);

	try {
		const requestInit = { ...init };
		const params = requestInit.params;

		delete requestInit.params;
		delete requestInit.timeoutInMs;

		const response = await fetch(
			`${buildUrl(path)}${buildQueryString(params)}`,
			{
				headers: {
					"Content-Type": "application/json",
					...requestInit.headers,
				},
				credentials: "include",
				signal: controller.signal,
				...requestInit,
			},
		);

		if (!response.ok) {
			throw createHttpError(response.status);
		}

		if (response.status === 204) {
			return undefined as TResponse;
		}

		return response.json() as Promise<TResponse>;
	} catch (error) {
		throw createApiError(error);
	} finally {
		globalThis.clearTimeout(timeout);
	}
};
