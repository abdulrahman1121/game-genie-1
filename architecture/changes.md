# Architecture changes

## 2026-11-09: game-over modal decoupled from gameStatus
- `gameMessage` state removed; the message is derived from `gameStatus` and `targetWord` in `GamePage`.
- New `showGameOver` flag, set by `Grid` 700ms after the `/guess` response, controls the modal. `gameStatus` no longer shows it.
- Why: the Firestore listener sets `gameStatus` before the `/guess` response, which showed a stale message and the modal before the tiles finished flipping. See CLAUDE.md Decisions Log (game-over timing).

## 2026-11-09: architecture folder created
- Initial diagrams for system overview, guess flow and data model; other flows still to add.
