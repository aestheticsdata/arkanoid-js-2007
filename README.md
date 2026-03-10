# Breakout (2007, modernized)

Tiny browser Breakout game originally made in 2007, modernized with Vite, strict TypeScript, and native CSS.

## What Changed

### Build and tooling modernization

- Migrated from legacy setup to `Vite`.
- Switched to `pnpm` scripts and workflow.
- Added strict TypeScript type-checking.
- Added `oxfmt` as formatter (`printWidth: 120`).
- Added `oxlint` as linter with `style` category disabled to avoid formatter conflicts.
- Added Lightning CSS as the CSS transformer in Vite.
- Enabled native CSS nesting through Lightning CSS drafts.

### Architecture refactor

- Refactored codebase from legacy DOM-style procedural logic to OOP TypeScript.
- Split responsibilities into dedicated modules:
  - `core`: game orchestration + config + physics helpers
  - `entities`: `ball`, `paddle`, `bricks`
  - `ui`: scoreboard rendering
  - `interfaces`: shared types/contracts
  - `shared`: DOM utilities
- Added TypeScript/Vite path aliases (`@core`, `@entities`, `@interfaces`, `@ui`, `@shared`, `@`).

### Gameplay changes

- Ball now starts on the paddle (inside game area) instead of spawning outside.
- Paddle collision now computes a dynamic bounce angle based on impact position.
- Brick wall now supports multiple configurable rows.
- Brick style is now fully configurable:
  - per-row colors/styles
  - per-brick overrides for special bricks (including gradients)
- Current default configuration uses `2` brick rows for validation.

### CSS system overhaul

- Replaced old CSS approach with native modular CSS files and token files.
- Introduced design tokens in `css/tokens/*` (colors, sizes, radii, typography, motion).
- Migrated color tokens to `oklch(...)`.
- Ball is rendered with CSS (gradient/glow), no image asset required.
- Brick visuals rely on `.brick` class and CSS custom properties instead of legacy inline hardcoded style values.
- Cursor hiding is handled with modern CSS state: `#gameArea.is-playing { cursor: none; }` (no blank `.ico` hack).

### Naming and terminology cleanup

- Removed remaining French identifiers in code naming (variables/functions/types).
- Replaced Arkanoid naming with Breakout naming across the project.

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
  core/
    config/     # Gameplay configuration (physics + brick rows/styles)
    physics/    # Shared gameplay physics helpers
    BreakoutGame.ts
  entities/
    ball/
    paddle/
    bricks/
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
- Brick rows, row colors, special bricks, and core physics values are configured in `src/core/config/BreakoutConfig.ts`.

### Gameplay configuration

Main gameplay tuning is centralized in `src/core/config/BreakoutConfig.ts`:

- Physics:
  - `tickMs`
  - `ballSpeed`
  - `initialLaunchAngleDeg`
  - `maxPaddleBounceAngleDeg`
- Bricks:
  - `columns`
  - `rows` (array; one entry per row with style)
  - `width`, `height`
  - `horizontalGap`, `verticalGap`
  - `topOffset`
  - `specialBricks` (targeted row/column overrides)

Example:

```ts
bricks: {
  columns: 17,
  rows: [{ style: { color: "var(--color-brick-row-1)" } }, { style: { color: "var(--color-brick-row-2)" } }],
  specialBricks: [
    { row: 0, column: 4, style: { background: "var(--gradient-brick-special)" } },
    { row: 1, column: 12, style: { background: "var(--gradient-brick-special-alt)" } }
  ]
}
```

### Paddle bounce angle

Paddle rebound is handled in `src/core/physics/PaddleBounce.ts` and applied from `src/core/BreakoutGame.ts`.

Principle:

- The paddle is split conceptually from left edge to right edge.
- Hit near center: mostly vertical rebound (safe, straight up).
- Hit near edges: stronger horizontal component (sharper angle).

Computation:

- `relativeHit = (ballCenterX - paddleCenterX) / (paddleWidth / 2)`, clamped to `[-1, 1]`.
- `bounceAngle = relativeHit * maxPaddleBounceAngleDeg`.
- New velocity keeps constant speed:
  - `vx = speed * sin(bounceAngle)`
  - `vy = -abs(speed * cos(bounceAngle))`

ASCII sketch:

```text
                  Upward playfield
                        ^
                        |
        sharper left    |   sharper right
             \          |        /
              \         |       /
               \        |      /
------------------------+------------------------> X
      left edge      paddle center           right edge

relativeHit = -1                      relativeHit = +1
angle ~= -max                         angle ~= +max
vx < 0, vy < 0                        vx > 0, vy < 0
```

Tuning:

- Increase `maxPaddleBounceAngleDeg` for more aggressive side rebounds.
- Decrease it for more vertical/forgiving gameplay.

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
