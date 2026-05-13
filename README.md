# Numble

A real-time multiplayer number-guessing game — Wordle for 5-digit codes. Two players set codes for each other, then race to guess. Whoever cracks the opponent's code first wins.

## Tech Stack

- React 19 + TypeScript + Vite
- Firebase 12 (Firestore + Anonymous Auth)
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

1. **Create a game** — enter your name, click Create Game. Share the lobby link/code.
2. **Join** — your opponent opens the link and enters their name.
3. **Set codes** — each player enters a secret 5-digit code for the other to guess.
4. **Guess** — up to 6 guesses each. Green = right digit, right position. Yellow = right digit, wrong position. Grey = not in code.
5. **Win** — first to solve wins. If both solve, the faster time wins. If neither solves, it's a draw.

## Firestore Rules

See [`firestore.rules`](./firestore.rules). The MVP rules allow host or guest to update any field — sufficient for a friend-vs-friend game. Add field-level validation before a public launch.

## Project Structure

```
src/
  lib/          types, game logic, Firebase, lobby utilities
  hooks/        useAuth, useTheme, useKeyboard, useToast
  components/   Tile, GuessRow, GameBoard, NumberKeyboard, ThemeToggle, PlayerStatus, Toast
  features/
    lobby/      LobbyPage + useLobby + usePresence
    game/       CodeSetup, GamePage, OpponentBoard, GameOver + useGame
    legal/      PrivacyPage, TermsPage
  pages/        HomePage
```
