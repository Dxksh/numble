import {
  doc, setDoc, updateDoc, getDoc, onSnapshot, arrayUnion,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import { determineWinner } from './gameLogic';
import type { Lobby, PlayerRole, Winner, Guess } from './types';

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export async function createLobby(hostUid: string, hostName: string): Promise<string> {
  const id = generateId();
  const now = Date.now();
  const lobby: Lobby = {
    hostUid, guestUid: null, hostName, guestName: null,
    hostReady: false, guestReady: false,
    phase: 'lobby', gameStarted: false, gameOver: false, winner: null,
    hostCode: '', guestCode: '',
    hostGuesses: [], guestGuesses: [],
    hostSolvedAt: null, guestSolvedAt: null,
    createdAt: now, updatedAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
    hostLastSeen: now, guestLastSeen: 0,
  };
  await setDoc(doc(db, 'lobbies', id), lobby);
  return id;
}

export async function getLobby(lobbyId: string): Promise<Lobby | null> {
  const snap = await getDoc(doc(db, 'lobbies', lobbyId));
  return snap.exists() ? (snap.data() as Lobby) : null;
}

export async function joinLobby(
  lobbyId: string, guestUid: string, guestName: string,
): Promise<void> {
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    guestUid, guestName,
    guestLastSeen: Date.now(), updatedAt: Date.now(),
  });
}

export function subscribeToLobby(
  lobbyId: string, callback: (lobby: Lobby | null) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'lobbies', lobbyId), snap => {
    callback(snap.exists() ? (snap.data() as Lobby) : null);
  });
}

export async function startGame(lobbyId: string): Promise<void> {
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    phase: 'code-setting', gameStarted: true, updatedAt: Date.now(),
  });
}

export async function submitCode(
  lobbyId: string, role: PlayerRole, code: string,
): Promise<void> {
  const codeField  = role === 'host' ? 'hostCode'  : 'guestCode';
  const readyField = role === 'host' ? 'hostReady' : 'guestReady';
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    [codeField]: code, [readyField]: true, updatedAt: Date.now(),
  });
}

export async function transitionToPlaying(lobbyId: string): Promise<void> {
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    phase: 'playing', updatedAt: Date.now(),
  });
}

export async function addGuess(
  lobbyId: string, role: PlayerRole, guess: Guess,
): Promise<void> {
  const field = role === 'host' ? 'hostGuesses' : 'guestGuesses';
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    [field]: arrayUnion(guess), updatedAt: Date.now(),
  });
}

export async function markSolved(
  lobbyId: string, role: PlayerRole, ts: number,
): Promise<void> {
  const field = role === 'host' ? 'hostSolvedAt' : 'guestSolvedAt';
  await updateDoc(doc(db, 'lobbies', lobbyId), { [field]: ts, updatedAt: Date.now() });
}

export async function finishGame(lobbyId: string, winner: Winner): Promise<void> {
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    phase: 'finished', gameOver: true, winner, updatedAt: Date.now(),
  });
}

export async function rematch(lobbyId: string): Promise<void> {
  const now = Date.now();
  await updateDoc(doc(db, 'lobbies', lobbyId), {
    phase: 'lobby',
    gameStarted: false,
    gameOver: false,
    winner: null,
    hostReady: false,
    guestReady: false,
    hostCode: '',
    guestCode: '',
    hostGuesses: [],
    guestGuesses: [],
    hostSolvedAt: null,
    guestSolvedAt: null,
    updatedAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  });
}

export async function updateLastSeen(
  lobbyId: string, role: PlayerRole,
): Promise<void> {
  const field = role === 'host' ? 'hostLastSeen' : 'guestLastSeen';
  await updateDoc(doc(db, 'lobbies', lobbyId), { [field]: Date.now() });
}

export function resolveWinner(lobby: Lobby): Winner {
  return determineWinner(
    lobby.hostSolvedAt, lobby.guestSolvedAt,
    lobby.hostGuesses.length, lobby.guestGuesses.length,
  );
}
