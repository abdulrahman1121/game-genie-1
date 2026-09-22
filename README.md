# Game Genie

An adaptive, AI-powered word puzzle game for kids that blends the simplicity of Wordle with personalized vocabulary learning.

**Live site:** [gogamegenie.com](https://gogamegenie.com)

## Problem Statement

Traditional vocabulary games like Wordle are fun but static — they don't adapt to a child's learning level or provide deeper support such as definitions, usage examples, or subject relevance. Kids need more engaging, scaffolded ways to build vocabulary across subjects.

## Solution

Game Genie evolves with the player's skills and interests, offering both an entertaining play experience and personalized learning opportunities, powered by AI-generated words, hints, definitions, and sentence practice.

## Features

**AI-Powered Personalization**
- Adaptive difficulty — word length (4–5 letters) scales with the selected level (beginner / intermediate / advanced)
- Word bank generated dynamically by OpenAI, avoiding recently used words
- Kid-friendly, AI-generated definitions and example sentences for every word
- Sentence-unscramble practice generated per word
- Tiered, context-based hints (e.g., "This is something you'd see in a forest")

**Core Gameplay**
- Wordle-style guess feedback (correct / present / incorrect) via on-screen or physical keyboard
- Dictionary validation of guesses (WordsAPI) with invalid-word feedback
- Rewards page with coin/point tracking per session

**Planned (In Development)**
- XP & leveling, streaks, and daily/weekly themed challenges
- Badges & achievements
- Avatar and theme customization
- "Remix Mode" — AI turns a learned word into a story, riddle, or drawing prompt
- Mini-game unlocks (spelling bee battles, AI word duels)

## Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React 19, Vite, React Router, CSS            |
| Backend    | Node.js, Express                             |
| AI         | OpenAI (GPT-4o) — word generation, hints, definitions, sentence unscrambling |
| Database   | Firebase Firestore (game state, recent words) |
| Dictionary | WordsAPI (guess validation)                  |
| Deployment | Render (backend/API), custom domain via gogamegenie.com (frontend) |

## Project Structure

```
game-genie-1/
├── backend/
│   ├── routes/openaiRoutes.js   # /start, /guess, /hint, /unscramble, /reset
│   ├── firebase.js              # Firebase Admin / Firestore setup
│   └── server.js                # Express app entry point
└── frontend/
    └── src/
        ├── pages/                # LandingPage, SelectLevelPage, GamePage, RewardsPage, Signup
        ├── components/           # Grid, Tile, Keyboard, Unscramble, Level, WelcomeModal
        └── lib/                  # apiBase.js — environment-aware API URL resolution
```

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project (Firestore enabled) and service account credentials
- An OpenAI API key
- A WordsAPI (RapidAPI) key

### Installation

```bash
git clone https://github.com/abdulrahman1121/game-genie-1.git
cd game-genie-1

cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `FIREBASE_TYPE`, `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_AUTH_URI`, `FIREBASE_TOKEN_URI`, `FIREBASE_UNIVERSE_DOMAIN` | Firebase Admin service account fields |
| `RENDER_URL` | Deployed backend URL, exposed via `/api/config` |

**`frontend/.env.local`**

| Variable | Description |
|---|---|
| `VITE_API_BASE` | Backend API base URL for local dev (e.g. `http://localhost:3000/api`) |
| `VITE_WORDS_API_KEY` | WordsAPI (RapidAPI) key for dictionary validation |

> Note: `frontend/index.html` enforces a Content-Security-Policy. If you change the API origin, add it to the `connect-src` directive or requests will be blocked by the browser.

### Running Locally

**Backend**
```bash
cd backend
node server.js
```
Runs on `http://localhost:3000` by default.

**Frontend**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173` by default.

## Gameplay

1. Select a difficulty level and start the game.
2. Guess the word using the on-screen keyboard or your keyboard, with Wordle-style letter feedback.
3. Use AI-generated hints when stuck.
4. Practice usage by unscrambling an AI-generated sentence containing the word.
5. Track coins/points on the Rewards page.

## Target Audience

Ages 6–13, with progressive difficulty levels and room for future voice narration support for younger learners.
