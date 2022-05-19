import fs from 'fs';

import {
  getGameInfo,
  addWord,
  removeWord,
  viewDictionary,
  resetGame,
  loadGame,
  saveGame,
} from './src/memory';

/**
 * Helper function to remove all memory_[NAME].json files in
 * the current directory.
 */
function removeSavedGames() {
  fs.readdirSync('./')
    .filter(file => /^memory_[a-zA-Z0-9]+\.json$/.test(file))
    .forEach(file => fs.unlinkSync('./' + file));
}

function reset() {
  removeSavedGames();
  resetGame();
}

beforeAll(reset);
afterEach(reset);

describe('addWord', () => {
  describe('error cases', () => {
    test('word exists', () => {
      expect(() => addWord('hello')).not.toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);
    });

    test('game over', () => {
      addWord('same');
      expect(() => addWord('same')).toThrow(Error);
      expect(() => addWord('same')).toThrow(Error);
      expect(() => addWord('same')).toThrow(Error);
      expect(() => addWord('different')).toThrow(Error);
    });
  });

  test('success cases', () => {
    addWord('one');
    addWord('two');
    addWord('three');
    expect(getGameInfo()).toStrictEqual({ score: 3, mistakesRemaining: 3, cluesRemaining: 3 });
    expect(viewDictionary()).toStrictEqual(['one', 'two', 'three']);
  });
});

describe('removeWord', () => {
  describe('error cases', () => {
    test('no such word', () => {
      expect(() => addWord('goodbye')).not.toThrow(Error);
      expect(() => removeWord('hello')).toThrow(Error);
    });

    test('double remove', () => {
      addWord('hello');
      expect(() => removeWord('hello')).not.toThrow(Error);
      expect(() => removeWord('hello')).toThrow(Error);
    });

    test('game over', () => {
      addWord('hello');
      expect(() => removeWord('world')).toThrow(Error);
      expect(() => removeWord('world')).toThrow(Error);
      expect(() => removeWord('world')).toThrow(Error);
      expect(() => removeWord('hello')).toThrow(Error);
    });
  });

  test('success cases', () => {
    addWord('one');
    addWord('two');
    addWord('three');
    removeWord('two');
    expect(getGameInfo()).toStrictEqual({ score: 4, mistakesRemaining: 3, cluesRemaining: 3 });
    expect(viewDictionary()).toStrictEqual(['one', 'three']);
  });
});

describe('viewDictionary', () => {
  describe('error cases', () => {
    test('no clues remaining', () => {
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(() => viewDictionary()).toThrow(Error);
    });
  });

  describe('success cases', () => {
    test('basic', () => {
      addWord('hi');
      expect(viewDictionary()).toStrictEqual(['hi']);
    });

    test('no error at 0 cluesRemaining when game over', () => {
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(() => viewDictionary()).toThrow(Error);
      addWord('one');
      expect(() => addWord('one')).toThrow(Error);
      expect(() => addWord('one')).toThrow(Error);
      expect(() => addWord('one')).toThrow(Error);
      expect(viewDictionary()).toStrictEqual(['one']);
    });
  });
});

describe('resetGame', () => {
  test('game resetted', () => {
    addWord('one');
    expect(() => addWord('one')).toThrow(Error);
    expect(getGameInfo()).toStrictEqual({ score: 1, mistakesRemaining: 2, cluesRemaining: 3 });
    expect(viewDictionary()).toStrictEqual(['one']);
    resetGame();
    expect(getGameInfo()).toStrictEqual({ score: 0, mistakesRemaining: 3, cluesRemaining: 3 });
    expect(viewDictionary()).toStrictEqual([]);
  });
});

describe('saveGame', () => {
  beforeEach(() => {
    // Avoid hardcode
    expect(() => saveGame('valid123')).not.toThrow(Error);
  });

  describe('error cases', () => {
    test('double save', () => {
      expect(() => saveGame('same')).not.toThrow(Error);
      expect(() => saveGame('same')).toThrow(Error);
    });

    test.each([
      '',
      ' ',
      '!',
      'a-z0-9A-Z',
    ])("name='%s'", (name) => {
      expect(() => saveGame(name)).toThrow(Error);
    });
  });

  describe('success cases', () => {
    test('basic', () => {
      expect(fs.existsSync('memory_comp1531save.json')).toBe(false);
      saveGame('comp1531save');
      expect(fs.existsSync('memory_comp1531save.json')).toBe(true);
    });
  });
});

describe('loadGame', () => {
  beforeEach(() => {
    // Avoid hardcode
    expect(() => saveGame('valid123')).not.toThrow(Error);
    expect(() => loadGame('valid123')).not.toThrow(Error);
  });

  describe('error cases', () => {
    test('unknown load', () => {
      expect(() => loadGame('same')).toThrow(Error);
    });

    test.each([
      '',
      ' ',
      '!',
      'a-z0-9A-Z',
    ])("name='%s'", (name) => {
      expect(() => loadGame(name)).toThrow(Error);
    });
  });

  describe('success cases', () => {
    test('basic', () => {
      addWord('hello');
      expect(() => addWord('hello')).toThrow(Error);
      viewDictionary();
      expect(getGameInfo()).toStrictEqual({ score: 1, mistakesRemaining: 2, cluesRemaining: 2 });
      saveGame('comp1531save');

      resetGame();
      expect(getGameInfo()).toStrictEqual({ score: 0, mistakesRemaining: 3, cluesRemaining: 3 });

      loadGame('comp1531save');
      expect(getGameInfo()).toStrictEqual({ score: 1, mistakesRemaining: 2, cluesRemaining: 2 });
    });

    test('complex', () => {
      addWord('one');
      saveGame('game1');
      expect(fs.existsSync('memory_game1.json')).toBe(true);

      addWord('two');
      addWord('three');
      saveGame('game2');
      expect(fs.existsSync('memory_game2.json')).toBe(true);

      resetGame();
      expect(getGameInfo()).toStrictEqual({ score: 0, mistakesRemaining: 3, cluesRemaining: 3 });

      loadGame('game1');
      expect(getGameInfo()).toStrictEqual({ score: 1, mistakesRemaining: 3, cluesRemaining: 3 });
      expect(viewDictionary()).toStrictEqual(['one']);

      loadGame('game2');
      expect(getGameInfo()).toStrictEqual({ score: 3, mistakesRemaining: 3, cluesRemaining: 3 });
      expect(viewDictionary()).toStrictEqual(['one', 'two', 'three']);
    });
  });
});
