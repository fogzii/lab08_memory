import fs from 'fs';

interface Game {
  score: number;
  mistakesRemaining: number;
  cluesRemaining: number;
  dictionary: string[];
}

const currentGame: Game = {
  score: 0,
  mistakesRemaining: 3,
  cluesRemaining: 3,
  dictionary: [],
};

// Note: key "dictionary" is NOT returned in this function.
export function getGameInfo() {
  // FIXME
  console.log('WARNING getGameInfo is not implemented!');
  return {
    score: -1,
    mistakesRemaining: -1,
    cluesRemaining: -1,
  };
}

export function addWord(word: string) {
  // FIXME
  throw new Error('addWord is not implemented!');
}

export function removeWord(word: string) {
  // FIXME
  throw new Error('removeWord is not implemented!');
}

export function viewDictionary() {
  // FIXME
  throw new Error('viewDictionary is not implemented!');
}

export function resetGame() {
  // FIXME
  console.log('WARNING: resetGame is not implemented!');
}

export function saveGame(name: string) {
  // FIXME
  throw new Error('saveGame is not implemented!');
}

export function loadGame(name: string) {
  // FIXME
  throw new Error('loadGame is not implemented!');
}
