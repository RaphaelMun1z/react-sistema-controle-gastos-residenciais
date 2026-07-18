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

- Autenticação mockada com persistência temporária de sessão.
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
- Os dados ainda estão isolados em services mockados enquanto a integração com uma API REST real não é implementada.

## Inspirações de design

### Inspiração 01

![Inspiração de design](https://cdn.dribbble.com/userupload/48074272/file/9ded7c9f0f4174a9b95de7714843bbd5.png?resize=1024x768&vertical=center)

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

O cliente HTTP está preparado para utilizar a variável `VITE_API_URL` quando uma API REST real for integrada.

```env
VITE_API_URL=http://localhost:3333
```

## Status atual

O projeto ainda está em desenvolvimento. A aplicação já possui uma arquitetura preparada para evolução profissional, com autenticação mockada, services isolados e estrutura pronta para futura integração com uma API REST real.
