export type ApiErrorType = "network" | "timeout" | "http" | "unknown";

export interface ApiError {
	type: ApiErrorType;
	message: string;
	status?: number;
}

export interface UiError {
	title: string;
	description: string;
	actionLabel?: string;
}

export type UiErrorContext =
	| "default"
	| "peopleList"
	| "peopleCreate"
	| "peopleDelete"
	| "transactionsList"
	| "transactionsCreate"
	| "transactionsDelete"
	| "summaryLoad"
	| "financialAnalysis"
	| "peopleOptionsLoad"
	| "signIn"
	| "signUp";

const httpErrorMessages: Record<number, string> = {
	400: "Não foi possível processar os dados enviados.",
	401: "Sua sessão expirou. Entre novamente para continuar.",
	403: "Você não tem permissão para realizar esta ação.",
	404: "Não encontramos as informações que você procurava.",
	409: "Já existe um registro com essas informações.",
	422: "Alguns dados informados são inválidos.",
	500: "Algo deu errado. Não conseguimos concluir essa ação agora.",
};

const defaultDescriptions = {
	retry: "Tente novamente em alguns instantes.",
	later: "Não conseguimos concluir essa ação agora. Tente novamente mais tarde.",
};

const contextTitles: Record<UiErrorContext, string> = {
	default: "Não foi possível carregar as informações agora.",
	peopleList: "Não foi possível carregar as pessoas cadastradas.",
	peopleCreate: "Não foi possível cadastrar a pessoa.",
	peopleDelete: "Não foi possível excluir a pessoa.",
	transactionsList: "Não foi possível carregar suas transações.",
	transactionsCreate: "Não foi possível registrar a transação.",
	transactionsDelete: "Não foi possível excluir a transação.",
	summaryLoad: "Não foi possível carregar seu resumo financeiro.",
	financialAnalysis: "Não foi possível concluir a análise",
	peopleOptionsLoad: "Não foi possível carregar as pessoas cadastradas.",
	signIn: "Não foi possível entrar agora.",
	signUp: "Não foi possível criar sua conta.",
};

export const createApiError = (error: unknown): ApiError => {
	if (isApiError(error)) {
		return error;
	}

	if (error instanceof DOMException && error.name === "AbortError") {
		return {
			type: "timeout",
			message: "Não foi possível carregar as informações agora.",
		};
	}

	if (error instanceof TypeError) {
		return {
			type: "network",
			message: "Não foi possível carregar as informações agora.",
		};
	}

	return {
	type: "unknown",
		message: "Algo deu errado. Não conseguimos concluir essa ação agora.",
	};
};

export const createHttpError = (status: number): ApiError => ({
	type: "http",
	status,
	message:
		httpErrorMessages[status] ?? "Algo deu errado. Não conseguimos concluir essa ação agora.",
});

export const getApiErrorMessage = (error: unknown) =>
	createApiError(error).message;

const getConflictMessage = (context: UiErrorContext) => {
	if (context === "peopleCreate") {
		return "Já existe uma pessoa cadastrada com esse e-mail.";
	}

	return "Já existe um registro com essas informações.";
};

export const getApiErrorFeedback = (
	error: unknown,
	context: UiErrorContext = "default",
): UiError => {
	const apiError = createApiError(error);

	if (apiError.type === "network" || apiError.type === "timeout") {
		return {
			title: contextTitles[context],
			description: defaultDescriptions.retry,
			actionLabel: "Tentar novamente",
		};
	}

	if (apiError.status === 401) {
		return {
			title:
				context === "signIn"
					? "E-mail ou senha incorretos."
					: "Sua sessão expirou.",
			description:
				context === "signIn"
					? "Verifique os dados informados e tente novamente."
					: "Entre novamente para continuar.",
		};
	}

	if (apiError.status === 403) {
		return {
			title: "Você não tem permissão para realizar esta ação.",
			description: "Se precisar continuar, solicite acesso a uma pessoa responsável.",
		};
	}

	if (apiError.status === 404) {
		return {
			title: "Não encontramos as informações que você procurava.",
			description: "Confira os dados e tente novamente.",
		};
	}

	if (apiError.status === 409) {
		return {
			title: getConflictMessage(context),
			description: "Revise as informações e tente novamente.",
		};
	}

	if (apiError.status === 400 || apiError.status === 422) {
		return {
			title: "Alguns dados precisam de atenção.",
			description: "Revise as informações preenchidas e tente novamente.",
		};
	}

	return {
		title: contextTitles[context] ?? "Algo deu errado.",
		description:
			apiError.status && apiError.status >= 500
				? defaultDescriptions.later
				: defaultDescriptions.retry,
		actionLabel: "Tentar novamente",
	};
};

export const getApiErrorTitle = (
	error: unknown,
	context: UiErrorContext = "default",
) => getApiErrorFeedback(error, context).title;

export const isApiError = (error: unknown): error is ApiError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"type" in error &&
		"message" in error
	);
};
