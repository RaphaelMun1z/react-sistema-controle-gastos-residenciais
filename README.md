# Sistema de Controle de Gastos Residenciais

![Versão](https://img.shields.io/github/v/tag/RaphaelMun1z/react-sistema-controle-gastos-residenciais?include_prereleases&sort=semver&label=vers%C3%A3o)

![React](https://img.shields.io/badge/React-19.2.7-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10.6.0-4B32C3?logo=eslint&logoColor=white)

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Material UI
- SCSS
- React Router
- React Hook Form
- Zod
- TanStack Query
- Context API
- Vitest
- React Testing Library
- MSW
- Playwright
- ESLint
- Prettier

## Arquitetura do projeto

```text
src/
├── app/
│   ├── providers/
│   ├── query/
│   ├── theme/
│   └── routes
├── shared/
│   ├── api/
│   └── components/
└── features/
    ├── authentication/
    ├── people/
    ├── transactions/
    └── summary/
```

## Funcionalidades

- Autenticação preparada para API REST com sessão via cookies.
- Rotas públicas e privadas.
- Cadastro e consulta de pessoas.
- Cadastro e consulta de transações.
- Resumo financeiro por pessoa.
- Filtros por pessoa e período.
- Visão geral de receitas, despesas e saldo.
- Interface preparada para análise financeira por IA.
- Estados de loading, erro e vazio.
- Confirmação antes de exclusões.

## Formulários

Os formulários utilizam React Hook Form com Zod para controle de estado,
validação, mensagens de erro e controle de submissão.

## Gerenciamento de dados

- Context API é utilizada para autenticação e estado global relacionado à sessão.
- TanStack Query é utilizado para dados assíncronos, cache, mutations e invalidação.
- Os dados são consumidos por services preparados para uma API REST real.
- Sem backend compatível em execução, a aplicação exibe estados de indisponibilidade de forma controlada.

## Inspirações de design

| Inspiração 01 | Inspiração 02 |
| --- | --- |
| ![Inspiração de design](https://cdn.dribbble.com/userupload/48074272/file/9ded7c9f0f4174a9b95de7714843bbd5.png?resize=1024x768&vertical=center) | ![Inspiração de design](https://cdn.dribbble.com/userupload/11344410/file/original-4e7176480f783d620ca109d0727a6191.png?resize=1024x768&vertical=center) |
| Inspiração 03 | Inspiração 04 |
| ![Inspiração de design](https://cdn.dribbble.com/userupload/43378691/file/original-c32d272e64d0a2144e44180739d569a3.png?resize=1024x714&vertical=center) | ![Inspiração de design](https://cdn.dribbble.com/userupload/42176526/file/original-ef593d29153ba02c3b5f7f9bb9cd0387.jpg?resize=1000x750&vertical=center) |

## Bibliotecas

### Material UI e Material Icons

Optei por utilizar uma biblioteca de componentes e ícones para acelerar o processo de desenvolvimento, aproveitando recursos de qualidade, responsivos, testados e visualmente agradáveis ao usuário.

### React Hook Form e Zod

Utilizados para estruturar os formulários com validação, mensagens por campo e controle de submissão.

### TanStack Query

Utilizado para organizar o gerenciamento de dados assíncronos, cache e invalidação de consultas.

## Testes

O projeto possui testes unitários e de componentes com Vitest e React Testing Library, além de configuração para testes E2E com Playwright.

```bash
npm test
npm run test:e2e
```

## Qualidade

O projeto utiliza ESLint, Prettier, build com Vite e CI via GitHub Actions para validar lint, testes e build.

```bash
npm run lint
npm run format
npm run build
```

## Como executar

```bash
npm install
npm run dev
```

Outros comandos disponíveis:

```bash
npm run build
npm run lint
npm test
npm run test:e2e
npm run preview
```

## Variáveis de ambiente

A URL da API REST é configurada pela variável `VITE_API_URL`.

```env
VITE_API_URL=http://localhost:8080/api
```

Use o arquivo `.env.example` como referência. Não inclua segredos no frontend.

## Integração com backend

O frontend está preparado para consumir endpoints REST de autenticação, pessoas, transações e resumo financeiro. Atualmente é necessário executar um backend compatível para obter dados reais.

Quando a API não está disponível, as telas exibem mensagens amigáveis de erro e ação para tentar novamente, sem utilizar mocks de runtime.

## Status atual

O projeto ainda está em desenvolvimento e preparado para futura integração com uma API REST real compatível com os endpoints configurados na camada de services.
