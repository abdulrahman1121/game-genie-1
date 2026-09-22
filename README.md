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
