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
