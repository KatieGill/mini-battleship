const rs = require("readline-sync");

const grid = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let gridPlacementTracker = [];
let guessTracker = [];
let shipsRemaining = 2;
let fleet = [];

const setGrid = (grid) => {
  let gridPlacement = grid[Math.floor(Math.random() * grid.length)];
  if (gridPlacementTracker.includes(gridPlacement)) {
    return setGrid(grid);
  } else {
    gridPlacementTracker.push(gridPlacement);
    return gridPlacement;
  }
};

const resetGrid = (grid) => {
  gridPlacementTracker = [];
  guessTracker = [];
  shipsRemaining = 2;
  return battleship(grid);
};

const playerGuess = (grid) => {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: grid,
    limitMessage: `That is not a valid location`,
  });
};

const guessResult = (guess) => {
  if (guessTracker.includes(guess)) {
    console.log(`You have already picked this location. Miss!`);
  } else if (fleet.includes(guess)) {
    shipsRemaining -= 1;
    const message =
      shipsRemaining === 1
        ? `Hit! You have sunk a battleship. 1 ship remaining.`
        : `You have destroyed all battleships!`;
    console.log(message);
  } else {
    console.log(`You have missed!`);
  }
  if (!guessTracker.includes(guess)) {
    guessTracker.push(guess);
  }
  return shipsRemaining;
};

const gamePlay = (grid) => {
  let guess = playerGuess(grid).toUpperCase();
  guessResult(guess);
  if (shipsRemaining > 0) {
    return gamePlay(grid);
  } else {
    if (rs.keyInYN(`Would you like to play again?`)) {
      return resetGrid(grid);
    }
  }
};

const battleship = (grid) => {
  rs.keyIn(`Press any key to start the game!`);
  fleet = [1, 2].map(() => setGrid(grid));
  return gamePlay(grid);
};

battleship(grid);
