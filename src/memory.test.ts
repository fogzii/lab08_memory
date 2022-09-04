import fs from 'fs';

import {
  getGameInfo,
  addWord,
  removeWord,
  viewDictionary,
  resetGame,
  loadGame,
  saveGame,
} from './memory';

test('Remove this test and uncomment the tests below', () => {
  expect(1 + 1).toStrictEqual(2);
});

/*

// Helper function to remove all memory_[NAME].json files in
// the current directory.
function removeSavedGames() {
  fs.readdirSync('./')
    .filter(file => /^memory_[a-zA-Z0-9]+\.json$/.test(file))
    .forEach(file => fs.unlinkSync('./' + file));
}

function clear() {
  removeSavedGames();
  resetGame();
}

beforeAll(() => {
  clear();
});

afterEach(() => {
  clear();
});

describe('addWord', () => {
  test('adding the same word twice', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
  });

  // TODO: more tests
});

describe('removeWord', () => {
  test('No such word', () => {
    expect(() => removeWord('hello')).toThrow(Error);
  });

  test('Double remove', () => {
    addWord('hello');
    expect(() => removeWord('hello')).not.toThrow(Error);
    expect(() => removeWord('hello')).toThrow(Error);
  });

  // TODO: more tests
});

// TODO: your other tests here

*/
