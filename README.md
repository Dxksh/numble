# Duel

A real-time 2-player duel platform. Pick a game mode, set a secret answer for your opponent, then race to crack theirs first. Currently ships with two modes — and the architecture makes adding more a one-file change.

## Game Modes

### Numble Duel
Wordle for 5-digit codes. Each player sets a secret number; first to guess the opponent's wins.

### Wordle Duel
Classic Wordle, head-to-head. Each player sets a secret 5-letter word; first to guess the opponent's wins.

### Adding a New Mode

Add a single entry to `GAME_MODES` in `src/lib/gameModes.ts` and extend the `GameMode` union in `src/lib/types.ts`. The mode picker, headers, labels, keyboard, and validation all pick it up automatically — no other files need touching.

## Tech Stack

- React 19 + TypeScript + Vite
- Firebase (Firestore + Anonymous Auth)
- React Router 7
- CSS Modules (no component library)
- canvas-confetti for win animations
- Vercel deployment

## Quick Start

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. **Authentication → Sign-in method** → Enable **Anonymous**.
3. **Firestore Database** → Create database in **production mode**.
4. **Project Settings → Your apps** → Add a **Web app** and copy the config values.

### 2. Set Firestore Security Rules

In **Firestore → Rules**, paste the contents of [`firestore.rules`](./firestore.rules) from this repo, then **Publish**.

### 3. Local Development

```bash
cp .env.example .env.local
# Edit .env.local and fill in your Firebase values

npm install
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Environment Variables

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Project Settings → Your apps → SDK snippet |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same — `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Same — your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same — `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `VITE_FIREBASE_APP_ID` | Same |

### 5. Deploy to Vercel

**Option A — Vercel CLI:**
```bash
npm i -g vercel
vercel
```

**Option B — Vercel Dashboard:**
1. Push this repo to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Set all `VITE_FIREBASE_*` environment variables in **Project → Settings → Environment Variables**.
4. Deploy.

The included `vercel.json` handles the SPA rewrite so all routes fall through to `index.html`.

### 6. Run Tests

```bash
npm test
```

## How to Play

1. **Pick a mode** — choose Numble Duel or Wordle Duel from the home screen.
2. **Create a game** — enter your name, click Create Game. Share the lobby link or code with your opponent.
3. **Join** — your opponent opens the link and enters their name.
4. **Set your answer** — each player secretly enters a 5-digit code (Numble) or 5-letter word (Wordle) for the other to guess.
5. **Guess** — up to 6 guesses each. Green = right character, right position. Yellow = right character, wrong position. Grey = not in the answer.
6. **Win** — first to solve wins. If both solve, the faster time wins. If neither solves in 6 guesses, it's a draw.

## Project Structure

```
src/
  lib/
    types.ts          shared types — GameMode, Lobby, Guess, etc.
    gameModes.ts      game mode config registry (add new modes here)
    gameLogic.ts      generic evaluateGuess, isSolved, getKeyboardStates
    wordList.ts       valid 5-letter words for Wordle validation
    lobbyUtils.ts     Firestore read/write helpers
    firebase.ts       Firebase initialisation
  hooks/              useAuth, useTheme, useKeyboard, useToast
  components/
    Tile/             single board tile with flip animation
    GuessRow/         row of 5 tiles
    GameBoard/        full 6-row board
    NumberKeyboard/   on-screen numeric keypad (Numble)
    LetterKeyboard/   on-screen QWERTY keyboard (Wordle)
    ThemeToggle/      dark/light mode toggle
    PlayerStatus/     online presence indicator
    Toast/            notification toasts
  features/
    lobby/            LobbyPage, useLobby, usePresence
    game/             CodeSetup, GamePage, OpponentBoard, GameOver, useGame
    legal/            PrivacyPage, TermsPage
  pages/              HomePage (mode picker + create/join)
```

## Firestore Rules

See [`firestore.rules`](./firestore.rules). Current rules allow host or guest to update any lobby field — fine for a friend-vs-friend game. Add field-level validation before a public launch.
