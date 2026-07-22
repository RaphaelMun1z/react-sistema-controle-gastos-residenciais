# Sistema de Controle de Gastos Residenciais

Frontend React/TypeScript para consumir o backend .NET + SQL Server do sistema de controle de gastos residenciais.

## Stack

- React 19, TypeScript e Vite
- Material UI e SCSS
- React Router
- TanStack Query
- React Hook Form + Zod
- Vitest, React Testing Library, MSW e Playwright

## Configuração

A API real fica sob `/api/v1` e usa JWT Bearer para endpoints protegidos.

```env
VITE_API_URL=http://localhost:7201/api/v1
VITE_BYPASS_AUTH=false
```

`VITE_BYPASS_AUTH=true` existe apenas para desenvolvimento local e testes controlados.

## Contratos Consumidos

- `POST /auth/register`: envia `name`, `birthDate`, `email`, `password`.
- `POST /auth/login`: retorna `accessToken` e `expiresAt`.
- `GET /auth/me`: retorna `accountId`, `personId`, `name`, `email`.
- `GET /people?page&pageSize&search?`: lista pessoas com paginação e busca por nome.
- `POST /people`: cadastra pessoa com `name` e `birthDate`.
- `GET /people/{id}` e `DELETE /people/{id}`.
- `GET /transactions?page&pageSize`: lista transações sob demanda.
- `POST /transactions`: envia `personId`, `amount`, `type`, `description`, `transactionDate`.
- `GET /transactions/{id}` e `GET /transactions/person/{personId}`.
- `GET /financial-summary?page&pageSize&startDate?&endDate?`: retorna totais gerais e pessoas paginadas.

Criações e buscas individuais que retornam HATEOAS são mapeadas como `Resource<T>` no service, mantendo os componentes sem acoplamento ao wrapper.

## Auth

O login salva o JWT e o `expiresAt`, depois carrega o usuário oficial via `GET /auth/me`. No refresh da página, um token válido é restaurado e `/auth/me` reconstrói o usuário autenticado.

Requisições protegidas recebem `Authorization: Bearer <token>` no cliente HTTP. O frontend não usa cookies de autenticação, `withCredentials` ou `credentials: "include"`.

Quando a sessão expira ou uma rota protegida retorna `401`, o token, usuário e cache de autenticação são limpos e a tela de login mostra a mensagem de sessão expirada. `401` no login é tratado como e-mail ou senha incorretos.

## Pessoas

IDs são UUID/string. A listagem usa paginação sob demanda e aceita `search` com debounce no frontend. A busca para Autocomplete também usa `GET /people?search=...&page=1&pageSize=10`, sem carregar todas as páginas.

A API recebe `birthDate` e retorna `age`, usado nas listagens e na regra preventiva que impede receitas para menores de 18 anos.

## Transações

O enum real do backend é:

- `0`: Despesa (`Expense`)
- `1`: Receita (`Revenue`)

O cadastro envia `transactionDate` no formato `YYYY-MM-DD`, sem horário. A data futura é bloqueada por `max` no input e por Zod. A tabela exibe a coluna Data formatada como `DD/MM/YYYY` e mantém `createdAt` apenas no tipo técnico.

## Resumo

O resumo usa exclusivamente `GET /financial-summary`.

O frontend renderiza `totalRevenue`, `totalExpense`, `balance` e `people.content` retornados pelo backend. Os totais gerais não são recalculados a partir da página atual. Filtros de período usam `startDate` e `endDate` em `YYYY-MM-DD`, com validação `startDate <= endDate`.

## Cache e Paginação

TanStack Query mantém cache por combinação de parâmetros:

- `["people", page, pageSize, search]`
- `["people-search", { search, page, pageSize }]`
- `["transactions", page, pageSize]`
- `["financial-summary", { page, pageSize, startDate, endDate }]`

As telas usam `placeholderData: keepPreviousData` para manter dados durante troca de página/refetch e não fazem carregamento massivo de páginas.

## Erros

O tratamento central considera mensagens específicas, `ValidationProblemDetails.errors`, `ProblemDetails.detail`, `ProblemDetails.title` e fallback contextual. Mensagens por campo são mapeadas para React Hook Form quando há correspondência clara.

## Executar

```bash
npm install
npm run dev
```

Execute o backend .NET separadamente e garanta que o CORS permita a origem do Vite.

## Validação

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```
