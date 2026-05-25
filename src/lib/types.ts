export type TileState = 'green' | 'yellow' | 'grey' | 'empty' | 'active';
export type Phase = 'lobby' | 'code-setting' | 'playing' | 'finished';
export type PlayerRole = 'host' | 'guest';
export type Winner = 'host' | 'guest' | 'draw' | null;
export type GameMode = 'numble' | 'wordle';

export interface Guess {
  guess: string;
  result: TileState[];
  createdAt: number;
}

export interface Lobby {
  hostUid: string;
  guestUid: string | null;
  hostName: string;
  guestName: string | null;
  hostReady: boolean;
  guestReady: boolean;
  phase: Phase;
  gameStarted: boolean;
  gameOver: boolean;
  winner: Winner;
  hostCode: string;
  guestCode: string;
  hostGuesses: Guess[];
  guestGuesses: Guess[];
  hostSolvedAt: number | null;
  guestSolvedAt: number | null;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  hostLastSeen: number;
  guestLastSeen: number;
  gameMode: GameMode;
}
