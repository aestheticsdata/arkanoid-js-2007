# Breakout (2007, modernized)

Tiny browser Breakout game originally made in 2007, modernized with Vite, strict TypeScript, and native CSS.

## Tutorial

Get the project running locally:

```bash
pnpm install
pnpm dev
```

Open the URL shown by Vite.

## How-to

Build for production:

```bash
pnpm build
pnpm preview
```

Run quality checks:

```bash
pnpm run fmt:check
pnpm run lint
pnpm run typecheck
```

Auto-fix formatting and lint issues:

```bash
pnpm run fmt
pnpm run lint:fix
```

## Reference

### Scripts

- `pnpm dev`: start dev server
- `pnpm build`: build production assets
- `pnpm preview`: preview the production build
- `pnpm run fmt`: format files with `oxfmt`
- `pnpm run fmt:check`: verify formatting without writing
- `pnpm run lint`: run `oxlint`
- `pnpm run lint:fix`: apply safe lint fixes
- `pnpm run typecheck`: run TypeScript type-checking (`tsc --noEmit`)

### Project structure

```text
src/
  core/         # Game orchestration (BreakoutGame)
  entities/     # Ball, Paddle, BrickWall
  interfaces/   # Shared TS types/interfaces
  shared/       # Shared utilities (DOM helpers)
  ui/           # UI concerns (Scoreboard)
  main.ts       # Bootstrap

css/
  main.css      # CSS entrypoint
  base.css
  layout.css
  components.css
  tokens/
    index.css
    colors.css
    sizes.css
    radii.css
    typography.css
    motion.css
```

### TypeScript configuration

- Strict mode is enabled.
- Path aliases are configured in both `tsconfig.json` and `vite.config.ts`.
- Available aliases: `@/*`, `@core/*`, `@entities/*`, `@interfaces/*`, `@ui/*`, `@shared/*`.

### CSS architecture

- Native CSS modules through file-level separation and native `@import`.
- Design tokens are centralized in `css/tokens/*`.
- Color tokens use `oklch(...)`.
- Native CSS nesting is enabled via Lightning CSS drafts.
- Lightning CSS repository: <https://github.com/parcel-bundler/lightningcss>
- Gameplay cursor hiding uses `#gameArea.is-playing { cursor: none; }`.

### Tooling policy

- Formatter: `oxfmt` (`printWidth: 120`) is the single formatting source of truth.
- Linter: `oxlint` enforces `correctness` and `suspicious`; `style` is disabled to avoid formatter conflicts.
- Oxfmt docs: <https://oxc.rs/docs/guide/usage/formatter>
- Oxfmt repository: <https://github.com/oxc-project/oxc>
- Oxlint docs: <https://oxc.rs/docs/guide/usage/linter>
- Oxlint repository: <https://github.com/oxc-project/oxc>

## Explanation

The project intentionally uses standards-first CSS and lightweight tooling:

- Native CSS + tokens keeps styling future-proof and framework-independent.
- Lightning CSS enables modern syntax (including nesting) while keeping output optimized.
- Strict TypeScript and OOP folder boundaries (`core`, `entities`, `ui`) make future feature additions safer.
- Splitting formatter (`oxfmt`) and linter (`oxlint`) responsibilities prevents style-rule conflicts.
