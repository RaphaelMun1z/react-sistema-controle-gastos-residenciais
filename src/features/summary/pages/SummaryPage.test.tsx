import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { server } from "../../../test/server";
import SummaryPage from "./SummaryPage";

const person = {
	id: 1,
	name: "Raphael Muniz",
	email: "raphael@email.com",
	age: 25,
};

const summary = {
	personId: 1,
	personName: "Raphael Muniz",
	income: 1500,
	expenses: 300,
};

const setupPeopleHandler = () => {
	server.use(http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json([person])));
};

const setupSummaryHandler = () => {
	server.use(http.get(`*${API_ENDPOINTS.summary}`, () => HttpResponse.json([summary])));
};

describe("SummaryPage", () => {
	it("envia filtros do resumo para a API", async () => {
		setupPeopleHandler();

		const summaryHandler = vi.fn(({ request }) => {
			const url = new URL(request.url);

			if (url.searchParams.get("personId") === "1") {
				return HttpResponse.json([summary]);
			}

			return HttpResponse.json([]);
		});

		server.use(http.get(`*${API_ENDPOINTS.summary}`, summaryHandler));

		renderWithProviders(<SummaryPage />);

		await userEvent.click(await screen.findByLabelText("Pessoa"));
		await userEvent.click(screen.getByRole("option", { name: "Raphael Muniz" }));
		await userEvent.type(screen.getByLabelText("Data inicial"), "2026-07-01");
		await userEvent.type(screen.getByLabelText("Data final"), "2026-07-31");

		await waitFor(() => {
			expect(summaryHandler).toHaveBeenCalledWith(
				expect.objectContaining({
					request: expect.objectContaining({
						url: expect.stringContaining("personId=1"),
					}),
				}),
			);
		});

		expect(
			await screen.findByRole("heading", { name: "Raphael Muniz" }),
		).toBeInTheDocument();
	});

	it("exibe animação enquanto a análise financeira está em andamento", async () => {
		setupPeopleHandler();
		setupSummaryHandler();

		server.use(
			http.post(`*${API_ENDPOINTS.summaryAnalysis}`, async () => {
				await new Promise((resolve) => globalThis.setTimeout(resolve, 100));

				return HttpResponse.json({
					summary: "Análise retornada pela API.",
				});
			}),
		);

		renderWithProviders(<SummaryPage />);

		await screen.findByRole("heading", { name: "Raphael Muniz" });
		await userEvent.click(
			screen.getByRole("button", { name: "Analisar transações" }),
		);

		expect(
			screen.getByRole("status", { name: "Analisando suas finanças" }),
		).toBeInTheDocument();
		expect(screen.getByText("Isso pode levar alguns instantes.")).toBeInTheDocument();
	});

	it("envia filtros atuais e renderiza o resultado retornado pela API", async () => {
		setupPeopleHandler();
		setupSummaryHandler();
		const analysisHandler = vi.fn(async ({ request }) => {
			expect(await request.json()).toEqual({
				personId: 1,
				startDate: "2026-07-01",
				endDate: "2026-07-31",
			});

			return HttpResponse.json({
				summary: "Seu mês está com saldo positivo.",
				positives: [
					{
						title: "Receitas consistentes",
						description: "As entradas superaram as despesas.",
					},
				],
				warnings: [
					{
						title: "Atenção aos gastos recorrentes",
						description: "Algumas categorias merecem acompanhamento.",
					},
				],
				recommendations: [
					{
						title: "Planeje o próximo mês",
						description: "Defina limites por categoria.",
					},
				],
			});
		});

		server.use(http.post(`*${API_ENDPOINTS.summaryAnalysis}`, analysisHandler));

		renderWithProviders(<SummaryPage />);

		await userEvent.click(await screen.findByLabelText("Pessoa"));
		await userEvent.click(screen.getByRole("option", { name: "Raphael Muniz" }));
		await userEvent.type(screen.getByLabelText("Data inicial"), "2026-07-01");
		await userEvent.type(screen.getByLabelText("Data final"), "2026-07-31");
		await userEvent.click(
			screen.getByRole("button", { name: "Analisar transações" }),
		);

		expect(await screen.findByText("Seu mês está com saldo positivo.")).toBeInTheDocument();
		expect(screen.getByText("Receitas consistentes")).toBeInTheDocument();
		expect(screen.getByText("Atenção aos gastos recorrentes")).toBeInTheDocument();
		expect(screen.getByText("Planeje o próximo mês")).toBeInTheDocument();

		await waitFor(() => {
			expect(analysisHandler).toHaveBeenCalledTimes(1);
		});
	});

	it("exibe erro amigável e permite tentar novamente", async () => {
		setupPeopleHandler();
		setupSummaryHandler();
		const analysisHandler = vi
			.fn()
			.mockImplementationOnce(() => new HttpResponse(null, { status: 500 }))
			.mockImplementationOnce(() =>
				HttpResponse.json({
					summary: "Análise concluída após nova tentativa.",
				}),
			);

		server.use(http.post(`*${API_ENDPOINTS.summaryAnalysis}`, analysisHandler));

		renderWithProviders(<SummaryPage />);

		await screen.findByRole("heading", { name: "Raphael Muniz" });
		await userEvent.click(
			screen.getByRole("button", { name: "Analisar transações" }),
		);

		expect(
			await screen.findByRole("heading", {
				name: "Não foi possível concluir a análise",
			}),
		).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

		expect(
			await screen.findByText("Análise concluída após nova tentativa."),
		).toBeInTheDocument();
		expect(analysisHandler).toHaveBeenCalledTimes(2);
	});

	it("não chama API quando não há dados suficientes para análise", async () => {
		setupPeopleHandler();
		server.use(http.get(`*${API_ENDPOINTS.summary}`, () => HttpResponse.json([])));
		const analysisHandler = vi.fn();
		server.use(http.post(`*${API_ENDPOINTS.summaryAnalysis}`, analysisHandler));

		renderWithProviders(<SummaryPage />);

		await screen.findByText(
			"Ainda não há dados suficientes para gerar o resumo financeiro.",
		);
		await userEvent.click(
			screen.getByRole("button", { name: "Analisar transações" }),
		);

		expect(
			await screen.findByRole("heading", {
				name: "Ainda não há dados suficientes para uma análise",
			}),
		).toBeInTheDocument();
		expect(analysisHandler).not.toHaveBeenCalled();
	});
});
