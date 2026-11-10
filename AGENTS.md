# Bubble shooter

A bubble shooter style puzzle game for the browser: TypeScript, canvas, Vite, Vitest.
The work is planned in GitHub issues on the project board https://github.com/users/DanniqueK/projects/4.

## Commands
- `npm run dev`: start the game on localhost
- `npm run check`: lint, typecheck and tests. Must pass before a PR.
- `npm run build`: production build

## Code
- Game rules (grid, matching, scoring) are pure functions in `src/game/`, without canvas or DOM, with a `*.test.ts` file next to each module.
- Drawing and input live in `src/ui/`. `src/main.ts` only wires things together.
- TypeScript is strict. No `as` casts (ESLint blocks them): narrow with type guards instead.

## Working from an issue
1. Read the issue, its parent issue and what it's blocked by: `gh issue view <number>`.
2. Move the card to In progress (see the board IDs below).
3. Branch from `main`: `feature/<number>-short-name` or `fix/<number>-short-name`.
4. Work through the "Done when" checklist in the issue. Conventional Commits, no issue numbers in commit messages.
5. Open a PR with `gh pr create`. The body starts with `Closes #<number>` and has the ticked checklist. The board moves the card when the PR is linked and merged.
6. Never push to `main` and never merge: a human reviews the PR.

## Board IDs
The board's built-in workflows add new issues and move merged work to Done. To move a card yourself:
```
gh project item-list 4 --owner DanniqueK --format json --jq ".items[] | select(.content.number == <number>) | .id"
gh project item-edit --project-id PVT_kwHOA9CYXM4Bq_ZA --id <item id> --field-id PVTSSF_lAHOA9CYXM4Bq_ZAzhpUCqQ --single-select-option-id <option>
```
Status options: Backlog `f75ad846`, Ready `61e4505c`, In progress `47fc9ee4`, In review `df73e18b`, Done `98236657`.
