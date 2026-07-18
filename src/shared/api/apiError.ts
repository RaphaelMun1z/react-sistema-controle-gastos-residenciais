export type ApiErrorType = "network" | "timeout" | "http" | "unknown";

export interface ApiError {
	type: ApiErrorType;
	message: string;
	status?: number;
}

const httpErrorMessages: Record<number, string> = {
	400: "Não foi possível processar os dados enviados.",
	401: "Sua sessão expirou. Entre novamente para continuar.",
	403: "Você não possui permissão para realizar esta ação.",
	404: "O recurso solicitado não foi encontrado.",
	409: "Já existe um registro com essas informações.",
	422: "Alguns dados informados são inválidos.",
	500: "Ocorreu um erro inesperado no servidor.",
};

export const createApiError = (error: unknown): ApiError => {
	if (isApiError(error)) {
		return error;
	}

	if (error instanceof DOMException && error.name === "AbortError") {
		return {
			type: "timeout",
			message: "Não foi possível conectar ao servidor.",
		};
	}

	if (error instanceof TypeError) {
		return {
			type: "network",
			message: "Não foi possível conectar ao servidor.",
		};
	}

	return {
		type: "unknown",
		message: "Não foi possível concluir a operação.",
	};
};

export const createHttpError = (status: number): ApiError => ({
	type: "http",
	status,
	message:
		httpErrorMessages[status] ?? "Ocorreu um erro inesperado no servidor.",
});

export const getApiErrorMessage = (error: unknown) =>
	createApiError(error).message;

export const isApiError = (error: unknown): error is ApiError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"type" in error &&
		"message" in error
	);
};
