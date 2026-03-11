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
- Enabled CSS nesting transpilation through Lightning CSS `include: Features.Nesting`.

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
- Pointer control now supports a hybrid mode with `Pointer Lock API` (relative mouse delta) plus classic fallback.
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

Deploy to production (versioned release + auto rollback on failure):

```bash
./scripts/deploy.sh deploy
```

Manual rollback to last backup:

```bash
./scripts/deploy.sh rollback
```

Manual rollback to a specific version:

```bash
./scripts/deploy.sh list-releases
./scripts/deploy.sh rollback-to release-YYYYMMDD-HHMMSS-branch-hash
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
- `./scripts/deploy.sh deploy`: build + upload + activate release with automatic rollback on detected failure
- `./scripts/deploy.sh rollback`: rollback to the previous backup version
- `./scripts/deploy.sh rollback-to <release_name>`: rollback to a specific stored release
- `./scripts/deploy.sh list-releases`: list versioned releases stored on the server

### Deployment strategy

- Target host default: `debian@ks-b`.
- Target path default: `/var/www/1991computer/arkanoid-2007`.
- Versioning:
  - each deploy creates `releases/release-<timestamp>-<branch>-<gitHash>`
  - each release includes `release.json` metadata
- Switch strategy:
  - staged release upload to `releases/...`
  - activation copies staged release into live directory
  - previous live version is stored in `/var/www/1991computer/arkanoid-2007.bak`
- Auto rollback:
  - if deploy fails after live switch or healthcheck fails, script restores backup automatically
- Manual rollback:
  - `rollback` restores `.bak`
  - `rollback-to` reactivates any specific release from `releases/`
- Healthcheck:
  - URL: `https://1991computer.com/arkanoid-2007/`
  - marker checked in HTML: `Breakout 2007`
- Nginx compatibility:
  - deploy script copies `index.html` to `arkanoid.html` to match current nginx `index arkanoid.html` config.

You can override defaults with env vars when running the script:

```bash
REMOTE_USER_HOST=debian@ks-b \
WEB_ROOT_BASE=/var/www/1991computer/arkanoid-2007 \
HEALTHCHECK_URL=https://1991computer.com/arkanoid-2007/ \
EXPECTED_HTML_MARKER="Breakout 2007" \
MAX_RELEASES_TO_KEEP=20 \
BUILD_BASE_PATH=./ \
./scripts/deploy.sh deploy
```

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

scripts/
  deploy.sh     # Deploy + rollback (auto/manual)

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

### Brick collision pre-calculation

`BrickWall` uses a pre-calculated grid lookup so each tick does not scan all bricks.

How it works:

- At mount time, bricks are stored in `brickGrid[row][column]`.
- Global wall bounds are precomputed (`wallBounds` + `wallStartX`).
- During collision checks:
  - first, a wall-level AABB culling rejects balls fully outside the brick zone
  - then only a small candidate range of rows/columns is tested
- This keeps collision checks closer to O(k) (local candidates) instead of O(n) (all bricks).

### Pointer input optimization

`BreakoutGame` caches the game area DOM rect to avoid calling `getBoundingClientRect()` on every mouse move event.

How it works:

- The rect is initialized when the game starts.
- It is refreshed on viewport changes (`resize` and `scroll`).
- Mouse move handling reuses the cached rect for paddle movement calculations.

This keeps pointer tracking behavior identical while reducing repeated layout reads during high-frequency input.

### Pointer Lock mode

`BreakoutGame` uses a hybrid pointer model to keep controls responsive when the mouse leaves the game area.

How it works:

- Default mode: classic absolute pointer control (`clientX`).
- Click inside `#gameArea`: requests `Pointer Lock` and switches to relative control (`movementX`).
- While locked, paddle movement no longer depends on pointer position in the viewport.
- Press `Esc` to exit lock and return to classic mode.

This avoids losing paddle control in edge cases where absolute mouse tracking stops receiving meaningful position updates.

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
- CSS nesting transpilation is enabled via Lightning CSS `include: Features.Nesting`.
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
