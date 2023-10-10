const rs = require('readline-sync');

const grid = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
let gridPlacementTracker = [];
let guessTracker = [];
let shipsRemaining = 2;
let firstShip = "";
let secondShip = "";

const setGrid = () => {
  let gridPlacement = grid[Math.floor(Math.random() * grid.length)];
  if (gridPlacementTracker.includes(gridPlacement)) {
    return setGrid();
  } else {
    gridPlacementTracker.push(gridPlacement);
    return gridPlacement;
  }
}

const resetGrid = () => {
  gridPlacementTracker = [];
  guessTracker = [];
  shipsRemaining = 2;
  return battleship();
}

const playerGuess = () => {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: grid,
    limitMessage: `That is not a valid location`,
    caseSensitive: true
  });
}

const guessResult = (guess) => {
  if (guessTracker.includes(guess)) {
    console.log(`You have already picked this location. Miss!`);
  } else if (guess === firstShip || guess === secondShip) {
    shipsRemaining -= 1;
    shipsRemaining === 1 ? console.log(`Hit! You have sunk a battleship. 1 ship remaining.`)
                         : console.log(`You have destroyed all battleships!`); 
    } else {
    console.log(`You have missed!`);
  }
  if (!guessTracker.includes(guess)) {
    guessTracker.push(guess);
  }
  return shipsRemaining;
}

const gamePlay = () => {
  let guess = playerGuess(grid);
  guessResult(guess);
  if (shipsRemaining > 0) {
    return gamePlay();
  } else {
    if (rs.keyInYN(`Would you like to play again?`)) {
      return resetGrid();
    }
  }
}

const battleship = () => {
  rs.keyIn(`Press any key to start the game!`);
  firstShip = setGrid();
  secondShip = setGrid();
  return gamePlay();
}

battleship();