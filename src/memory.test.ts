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

describe('getGameInfo', () => {
  test('function called at the beginning', () => {
    expect(getGameInfo()).toStrictEqual(
      {
        score: 0,
        mistakesRemaining: 3,
        cluesRemaining: 3,
      }
    );
  });

  test('function called during middle of active game', () => {
    // +1 score
    addWord('hello');

    // -2 mistakes
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);

    // -1 clue
    viewDictionary();

    expect(getGameInfo()).toStrictEqual(
      {
        score: 1,
        mistakesRemaining: 1,
        cluesRemaining: 2,
      }
    );
  });

  test('function called after inactive game', () => {
    // +1 score
    addWord('hello');

    // -1 clue
    viewDictionary();

    // -3 mistakes
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);

    // game is now inactive
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('penguin')).toThrow(Error);
    viewDictionary();

    expect(getGameInfo()).toStrictEqual(
      {
        score: 1,
        mistakesRemaining: 0,
        cluesRemaining: 2,
      }
    );
  });
});

describe('addWord', () => {
  describe('error', () => {
    test('the game is inactive', () => {
      expect(() => addWord('hello')).not.toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);

      //game is now inactive
      expect(getGameInfo().mistakesRemaining).toStrictEqual(0);
      expect(() => addWord('new')).toThrow(Error);
    });
    test('adding the same word twice', () => {
      expect(() => addWord('hello')).not.toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);
    });
  });
  describe('success', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('HELLO')).not.toThrow(Error);
    expect(() => addWord('heLLo')).not.toThrow(Error);
    expect(() => addWord('cow')).not.toThrow(Error);
    expect(() => addWord('bird')).not.toThrow(Error);

    expect(getGameInfo().score).toStrictEqual(5);
    expect(getGameInfo().mistakesRemaining).toStrictEqual(3);

    expect(viewDictionary()).toStrictEqual(['hello', 'HELLO', 'heLLo', 'cow', 'bird']);
  });
});

describe('removeWord', () => {
  describe('error', () => {
    test('the game is inactive', () => {
      addWord('hello');
      for (let i = 0; i < 3; i++) {
        expect(() => addWord('hello')).toThrow(Error);
      }

      //game is now inactive
      expect(getGameInfo().mistakesRemaining).toStrictEqual(0);
      expect(() => removeWord('hello')).toThrow(Error);
    });

    test('No such word', () => {
      expect(() => removeWord('hello')).toThrow(Error);
    });
  
    test('Double remove', () => {
      addWord('hello');
      expect(() => removeWord('hello')).not.toThrow(Error);
      expect(() => removeWord('hello')).toThrow(Error);
    });
  });

  describe('success', () => {
    test('removing multiple words', () => {
      addWord('apples');
      addWord('banana');
      addWord('APPLES');
      addWord('Banana');

      expect(() => removeWord('Banana')).not.toThrow(Error);
      expect(() => removeWord('apples')).not.toThrow(Error);
      expect(() => removeWord('banana')).not.toThrow(Error);
      expect(() => removeWord('APPLES')).not.toThrow(Error);

      expect(getGameInfo().score).toStrictEqual(8);
      expect(getGameInfo().mistakesRemaining).toStrictEqual(3);

      expect(viewDictionary()).toStrictEqual([]);
    });
  });
});

describe('viewDictionary', () => {
  describe('error', () => {
    test('no clues remaining during an active game', () => {
      addWord('hello');
      viewDictionary();
      viewDictionary();
      viewDictionary();

      // no clues left
      expect(() => viewDictionary()).toThrow(Error);
    });
  });

  describe('success', () => {
    test('function called during active game', () => {
      addWord('apples');
      addWord('banana');

      expect(() => viewDictionary()).not.toThrow(Error);
      expect(viewDictionary()).toStrictEqual(['apples', 'banana']);
    });

    test('function called during inactive game', () => {
      addWord('hello');

      // -1 clue
      viewDictionary();

      // -3 mistakes
      expect(() => addWord('hello')).toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);
      expect(() => addWord('hello')).toThrow(Error);

      // game is now inactive
      expect(() => viewDictionary()).not.toThrow(Error);
      expect(viewDictionary()).toStrictEqual(['hello']);
    });
  });
});

describe('resetGame', () => {
  test('successfully game reset', () => {
    addWord('hello');
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    viewDictionary();

    expect(() => resetGame()).not.toThrow(Error);

    expect(getGameInfo()).toStrictEqual(
      {
        score: 0,
        mistakesRemaining: 3,
        cluesRemaining: 3,
      }
    );
  });
});

describe('saveGame', () => {
  describe('errors', () => {
    test('name given is an empty string', () => {
      addWord('hello');
      viewDictionary();
      expect(() => saveGame('')).toThrow(Error);
    });

    test('name given is not alphanumeric', () => {
      addWord('hello');
      viewDictionary();
      expect(() => saveGame('!@##$^')).toThrow(Error);
    });

    test('game of this name is already saved', () => {
      addWord('hello');
      viewDictionary();
      expect(() => saveGame('game')).not.toThrow(Error);

      resetGame();

      addWord('penguin');
      expect(() => saveGame('game')).toThrow(Error);
    });
  });

  describe('success', () => {
    test('game saved', () => {
      addWord('hello');
      viewDictionary();
      expect(() => saveGame('game')).not.toThrow(Error);

      resetGame();
      loadGame('game');
      expect(getGameInfo()).toStrictEqual(
        {
          score: 1,
          mistakesRemaining: 3,
          cluesRemaining: 2,
        }
      );
      expect(viewDictionary()).toStrictEqual(['hello']);
      expect(fs.existsSync('./memory_game.json')).toBe(true);
    });
  });
});

describe('loadGame', () => {
  describe('errors', () => {
    test('name given is an empty string', () => {
      expect(() => loadGame('')).toThrow(Error);
    });

    test('name given is not alphanumeric', () => {
      expect(() => loadGame('!@##$^')).toThrow(Error);
    });

    test('game of this name is already saved', () => {
      addWord('hello');
      viewDictionary();
      saveGame('game');

      resetGame();
      expect(() => loadGame('potato')).toThrow(Error);
    });
  });

  describe('success', () => {
    test('game loaded', () => {
      addWord('hello');
      viewDictionary();
      saveGame('game');

      resetGame();
      expect(() => loadGame('game')).not.toThrow(Error);

      expect(getGameInfo()).toStrictEqual(
        {
          score: 1,
          mistakesRemaining: 3,
          cluesRemaining: 2,
        }
      );
      expect(viewDictionary()).toStrictEqual(['hello']);
    });
  });
});