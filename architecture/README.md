# Architecture

Visual notes on what Game Genie does, focused on data flow and how data changes over time.
Every component and flow is marked `built` or `planned`; nothing planned is drawn as if it exists.

| File | Covers |
|------|--------|
| [data-flow.md](data-flow.md) | System overview, the guess / game-over flow, Firestore data model |
| [changes.md](changes.md) | Dated log of architecture changes |

## How to update
- Change these files in the same commit/PR as the code that changes data flow.
- Check each diagram against the real code (routes in `backend/routes/`, Firestore writes, React state), not memory.
- Not yet diagrammed: `/start`, `/hint`, `/unscramble`, `/validate-word`, session token minting and the OpenAI fallback path.
