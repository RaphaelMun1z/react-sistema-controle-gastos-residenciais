import { expect, test } from "@playwright/test";

const isBypassAuthEnabled = process.env.VITE_BYPASS_AUTH === "true";

test("redireciona rotas privadas para login quando bypass está desligado", async ({
	page,
}) => {
	test.skip(isBypassAuthEnabled);

	await page.goto("/pessoas");

	await expect(page).toHaveURL(/\/entrar$/);
	await expect(page.getByRole("heading", { name: "Acesse sua conta" })).toBeVisible();
});

test("permite navegar em rotas privadas quando bypass está ligado", async ({
	page,
}) => {
	test.skip(!isBypassAuthEnabled);

	await page.goto("/pessoas");
	await expect(
		page.getByRole("heading", {
			name: "Não foi possível carregar as pessoas cadastradas.",
		}),
	).toBeVisible({ timeout: 25000 });

	await page.goto("/transacoes");
	await expect(
		page.getByRole("heading", {
			name: "Não foi possível carregar suas transações.",
		}),
	).toBeVisible({ timeout: 25000 });

	await page.goto("/resumo");
	await expect(
		page.getByRole("heading", {
			name: "Não foi possível carregar seu resumo financeiro.",
		}),
	).toBeVisible({ timeout: 25000 });
});

test("mantém layout sem overflow horizontal nas rotas principais", async ({
	page,
}) => {
	test.skip(!isBypassAuthEnabled);

	for (const path of ["/pessoas", "/transacoes", "/resumo"]) {
		await page.goto(path);
		await page.waitForLoadState("networkidle");

		const hasHorizontalOverflow = await page.evaluate(
			() => document.documentElement.scrollWidth > window.innerWidth,
		);

		expect(hasHorizontalOverflow).toBe(false);
	}
});

test("abre e fecha navegação mobile pelo menu", async ({ page }, testInfo) => {
	test.skip(!isBypassAuthEnabled || testInfo.project.name !== "mobile");

	await page.goto("/pessoas");
	await page.getByRole("button", { name: "Abrir navegação" }).click();
	await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();

	await page.getByRole("tab", { name: /Transações/ }).click();
	await expect(page).toHaveURL(/\/transacoes$/);
	await expect(
		page.getByRole("navigation", { name: "Navegação principal" }),
	).not.toBeVisible();
});

test("mostra resumo derivado e informa IA indisponível", async ({ page }, testInfo) => {
	test.skip(!isBypassAuthEnabled || testInfo.project.name !== "desktop");

	const personId = "11111111-1111-4111-8111-111111111111";

	await page.route("**/api/v1/people**", async (route) => {
		await route.fulfill({
			json: {
				content: [
					{
						id: personId,
						name: "Raphael Muniz",
						birthDate: "2001-07-18",
						age: 25,
					},
				],
				page: 1,
				pageSize: 100,
				totalElements: 1,
				totalPages: 1,
			},
		});
	});

	await page.route("**/api/v1/transactions**", async (route) => {
		await route.fulfill({
			json: {
				content: [
					{
						id: "22222222-2222-4222-8222-222222222222",
						personId,
						amount: 1500,
						type: 1,
						description: "Salário",
					},
					{
						id: "33333333-3333-4333-8333-333333333333",
						personId,
						amount: 300,
						type: 0,
						description: "Mercado",
					},
				],
				page: 1,
				pageSize: 100,
				totalElements: 2,
				totalPages: 1,
			},
		});
	});

	await page.goto("/resumo");
	await expect(page.getByRole("heading", { name: "Raphael Muniz" })).toBeVisible();
	await expect(page.getByText(/R\$\s*1.500,00/).first()).toBeVisible();
	await expect(page.getByText(/R\$\s*300,00/).first()).toBeVisible();

	await page.getByRole("button", { name: "Analisar transações" }).click();

	await expect(
		page.getByRole("heading", {
			name: "Análise com IA estará disponível em breve.",
		}),
	).toBeVisible();

	await page.getByRole("button", { name: "Fechar", exact: true }).click();
	await expect(
		page.getByRole("dialog", { name: "Análise financeira com IA" }),
	).not.toBeVisible();
});
