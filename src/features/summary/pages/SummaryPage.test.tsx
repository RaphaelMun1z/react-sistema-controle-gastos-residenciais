import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { server } from "../../../test/server";
import SummaryPage from "./SummaryPage";

describe("SummaryPage", () => {
	it("envia filtros do resumo para a API", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json([
					{
						id: 1,
						name: "Raphael Muniz",
						email: "raphael@email.com",
						age: 25,
					},
				]),
			),
		);

		const summaryHandler = vi.fn(({ request }) => {
			const url = new URL(request.url);

			if (url.searchParams.get("personId") === "1") {
				return HttpResponse.json([
					{
						personId: 1,
						personName: "Raphael Muniz",
						income: 1500,
						expenses: 300,
					},
				]);
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
});
