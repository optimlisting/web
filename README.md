# OptimListing

This is a Turborepo that contains the landing page and dashboard app for OptimListing — AI-powered marketplace listing optimization.

## Currently supported marketplaces

- Etsy
- Ebay (coming soon)
- Amazon (coming soon)

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `dashboard`: a [Next.js](https://nextjs.org/) app
- `landing`: Astro website
- `@optim/ui`: a stub React component library shared by both `landing` website and `dashboard` application
- `@optim/ai`: ...
- `@optim/auth`: better-auth (used by dashboard for now)
- `@optim/connections`: marketplace connections
- `@optim/db`: postgres database with prisma
- `@optim/email`: Resend emails
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd optimlisting/web
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd optimlisting/web
npx turbo build
pnpm dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=landing
```

Without global `turbo`:

```sh
npx turbo build --filter=landing
pnpm exec turbo build --filter=landing
pnpm exec turbo build --filter=landing
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd optimlanding/web
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd optimlanding/web
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=landing
```

Without global `turbo`:

```sh
npx turbo dev --filter=landing
pnpm exec turbo dev --filter=landing
pnpm exec turbo dev --filter=landing
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
