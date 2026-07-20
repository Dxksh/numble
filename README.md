<h1 align="center">Duelle</h1>

<p align="center">
  A real-time two-player duel platform. Set a secret answer for your opponent, then race to crack theirs first.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <a href="https://duelle-game.vercel.app"><strong>▶ Play now</strong></a>
</p>

---

## ✨ Features

- **🎮 Two game modes** — Numble Duel (5-digit codes) and Wordle Duel (5-letter words), head-to-head.
- **⚡ Real-time sync** — Firestore listeners keep both boards live; you watch your opponent's progress as it happens.
- **🔌 Pluggable modes** — adding a new mode is one entry in `GAME_MODES` plus a union member. Picker, headers, keyboard, and validation all derive from it.
- **👤 Zero-friction join** — Firebase Anonymous Auth, share a link or code, no sign-up.
- **🟢 Presence** — live online/offline indicator for each player.
- **🌗 Dark & light themes** — persisted toggle, CSS custom properties throughout.
- **⌨️ Full keyboard support** — physical keyboard plus mode-specific on-screen keypads.
- **🎉 Win states** — confetti, tiebreak by solve time, draw handling on six failed guesses.
- **🧪 Tested** — Vitest coverage over the guess-evaluation and keyboard-state logic.

## 🕹 How to play

1. **Pick a mode** — Numble Duel or Wordle Duel from the home screen.
2. **Create a game** — enter your name, share the lobby link or code.
3. **Set your answer** — each player secretly enters the code or word their opponent must guess.
4. **Guess** — six attempts each. Green = right character, right position. Yellow = right character, wrong position. Grey = not in the answer.
5. **Win** — first to solve takes it. Both solve? Faster time wins. Neither solves? Draw.

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| UI | React 19, CSS Modules (no component library) |
| Language | TypeScript |
| Build | Vite 5 |
| Routing | React Router 7 |
| Backend | Firebase — Firestore + Anonymous Auth |
| Testing | Vitest, Testing Library, happy-dom |
| Deploy | Vercel, with Firestore rules deployed via GitHub Actions |

## 🚀 Quick start

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project.
2. **Authentication → Sign-in method** → enable **Anonymous**.
3. **Firestore Database** → create in **production mode**.
4. **Project Settings → Your apps** → add a **Web app** and copy the config values.

### 2. Set Firestore security rules

In **Firestore → Rules**, paste the contents of [`firestore.rules`](./firestore.rules), then **Publish**.

### 3. Run locally

```bash
cp .env.example .env.local   # then fill in your Firebase values
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### 4. Environment variables

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Project Settings → Your apps → SDK snippet |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same — `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Same — your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same — `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `VITE_FIREBASE_APP_ID` | Same |

### 5. Test

```bash
npm test          # single run
npm run test:ui   # watch mode with UI
```

### 6. Deploy

```bash
npm i -g vercel && vercel
```

Or import the repo at [vercel.com/new](https://vercel.com/new) and set the `VITE_FIREBASE_*` variables under **Project → Settings → Environment Variables**. The included `vercel.json` handles the SPA rewrite so every route falls through to `index.html`.

## 🧩 Adding a game mode

Add one entry to `GAME_MODES` in `src/lib/gameModes.ts` and extend the `GameMode` union in `src/lib/types.ts`. The mode picker, board headers, labels, keyboard selection, and input validation all read from that config — no other files need touching.

## 📁 Project structure

```
src/
  lib/
    types.ts          shared types — GameMode, Lobby, Guess
    gameModes.ts      mode config registry (add new modes here)
    gameLogic.ts      evaluateGuess, isSolved, getKeyboardStates
    wordList.ts       valid 5-letter words for Wordle validation
    lobbyUtils.ts     Firestore read/write helpers
    firebase.ts       Firebase initialisation
  hooks/              useAuth, useTheme, useKeyboard, useToast
  components/
    Tile/             board tile with flip animation
    GuessRow/         row of five tiles
    GameBoard/        full six-row board
    NumberKeyboard/   numeric keypad (Numble)
    LetterKeyboard/   QWERTY keyboard (Wordle)
    ThemeToggle/      dark/light toggle
    PlayerStatus/     presence indicator
    Toast/            notifications
  features/
    lobby/            LobbyPage, useLobby, usePresence
    game/             CodeSetup, GamePage, OpponentBoard, GameOver, useGame
    legal/            PrivacyPage, TermsPage
  pages/              HomePage — mode picker, create/join
```


---

<p align="center">
  Built by <a href="https://github.com/Dxksh">Daksh Singhvi</a>
</p>
