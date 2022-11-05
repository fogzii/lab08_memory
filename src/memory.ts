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
  return {
    score: currentGame.score,
    mistakesRemaining: currentGame.mistakesRemaining,
    cluesRemaining: currentGame.cluesRemaining,
  };
}

export function addWord(word: string) {
  if (currentGame.mistakesRemaining === 0) {
    throw new Error('game is inactive!');
  }

  if (currentGame.dictionary.includes(word)) {
    currentGame.mistakesRemaining--;
    throw new Error('given word already exists in the current game\'s dictionary');
  }

  currentGame.dictionary.push(word);
  currentGame.score++;
}

export function removeWord(word: string) {
  if (currentGame.mistakesRemaining === 0) {
    throw new Error('game is inactive!');
  }

  if (!currentGame.dictionary.includes(word)) {
    currentGame.mistakesRemaining--;
    throw new Error('given word does not exist in the current game\'s dictionary');
  }

  currentGame.dictionary.splice(currentGame.dictionary.indexOf(word), 1);
  currentGame.score++;
}

export function viewDictionary() {
  if (currentGame.mistakesRemaining !== 0 && currentGame.cluesRemaining === 0) {
    throw new Error('no clues remaining during an active game!');
  }

  if (currentGame.mistakesRemaining === 0) {
    return currentGame.dictionary;
  }

  // else
  currentGame.cluesRemaining--;
  return currentGame.dictionary;
}

export function resetGame() {
  currentGame.score = 0;
  currentGame.cluesRemaining = 3;
  currentGame.mistakesRemaining = 3;
  currentGame.dictionary = [];
}

export function saveGame(name: string) {
  if (name === '') {
    throw new Error('the name given is an empty string!');
  }

  if (/^[A-Za-z0-9]*$/.test(name) === false) {
    throw new Error('the name given is not alphanumeric!');
  }

  if (fs.existsSync(`./memory_${name}.json`)) {
    throw new Error('a game of this name is already saved!');
  }

  fs.writeFileSync(`./memory_${name}.json`, JSON.stringify(currentGame, null, 2));
}

export function loadGame(name: string) {
  if (name === '') {
    throw new Error('the name given is an empty string!');
  }

  if (/^[A-Za-z0-9]*$/.test(name) === false) {
    throw new Error('the name given is not alphanumeric!');
  }

  if (!fs.existsSync(`./memory_${name}.json`)) {
    throw new Error('no saved games correspond to the given name!');
  }

  let data = JSON.parse(fs.readFileSync(`./memory_${name}.json`, 'utf8'));
  currentGame.score = data.score;
  currentGame.mistakesRemaining = data.mistakesRemaining;
  currentGame.cluesRemaining = data.cluesRemaining;
  currentGame.dictionary = data.dictionary;
}
