# Sistema de Controle de Gastos Residenciais

Frontend React/TypeScript para consumir o backend .NET do sistema de controle de gastos residenciais.

## Stack

- React 19, TypeScript e Vite
- Material UI
- React Router
- TanStack Query
- React Hook Form + Zod
- Vitest, React Testing Library, MSW e Playwright

## Backend

A API real fica sob `/api/v1` e usa JWT Bearer para endpoints protegidos.

Configure a base do backend em `.env`:

```env
VITE_API_URL=http://localhost:7201/api/v1
VITE_BYPASS_AUTH=false
```

`VITE_BYPASS_AUTH=true` existe apenas para desenvolvimento local e testes controlados. A autenticação real permanece implementada.

## Contratos Consumidos

- `POST /auth/register`: cria usuário, pessoa e conta. Envia `name`, `birthDate`, `email`, `password`.
- `POST /auth/login`: recebe `accessToken` e `expiresAt`.
- `GET /people?page&pageSize`: retorna `PagedResponse<Person>`.
- `POST /people`: cadastro administrativo de pessoa com `name` e `birthDate`.
- `DELETE /people/{id}`: exclui pessoa por UUID.
- `GET /transactions?page&pageSize`: retorna `PagedResponse<Transaction>`.
- `POST /transactions`: cria transação com `personId`, `amount`, `type`, `description`.
- `GET /transactions/person/{personId}?page&pageSize`: disponível no service para uso futuro.

Criações e buscas individuais que retornam HATEOAS são mapeadas como `Resource<T>` no service, mantendo os componentes sem acoplamento ao wrapper.

## Auth

O login armazena o JWT e o `expiresAt` de forma centralizada. Requisições protegidas recebem `Authorization: Bearer <token>` no cliente HTTP.

Quando a sessão expira ou uma rota protegida retorna `401`, o token é limpo e o usuário deve entrar novamente. Não há refresh token no contrato atual.

Armazenar JWT no browser tem implicações de segurança; esta implementação segue o contrato atual do backend, que retorna o token no corpo da resposta e não expõe cookie HttpOnly.

## Pessoas

IDs são UUID/string. O cadastro administrativo de pessoa não envia e-mail, senha ou idade. A API recebe `birthDate` e retorna `age`, usado nas listagens e na regra de menor de idade.

## Transações

O enum real do backend é:

- `0`: Despesa (`Expense`)
- `1`: Receita (`Revenue`)

O frontend centraliza esse mapeamento e não envia strings como `income`/`expense`.

O contrato atual não possui update/delete de transações. A interface não expõe essas ações.

## Resumo

O backend atual não possui endpoint dedicado de resumo financeiro. O frontend mantém a tela agregando dados localmente a partir de todas as páginas de pessoas e transações carregadas pela API.

Filtros por período estão desabilitados porque o contrato de transações atual não retorna data nem aceita `startDate`/`endDate`.

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

## Possíveis Melhorias No Backend

- Endpoint agregado de resumo financeiro.
- Filtros server-side por período.
- Busca/autocomplete de pessoas.
- Refresh token ou estratégia de sessão mais robusta.
