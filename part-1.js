const rs = require('readline-sync');
const grid = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
let gridPlacementTracker = [];
let guessTracker = [];
let shipsRemaining = 2;
let firstShip = "";
let secondShip = "";


function setGrid(grid) {
  let gridPlacement = grid[Math.floor(Math.random() * grid.length)];
  if (gridPlacementTracker.includes(gridPlacement)) {
    setGrid(grid)
  } else {
    gridPlacementTracker.push(gridPlacement);
    return gridPlacement;
  }
}

function resetGrid() {
  gridPlacementTracker = [];
  guessTracker = [];
  shipsRemaining = 2;
}

function playerGuess(grid) {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: grid,
    limitMessage: `That is not a valid location`
  });
}

function guessResult(guess) {
  if (guessTracker.includes(guess)) {
    console.log(`You have already picked this location. Miss!`);
  } else if (guess === firstShip || guess === secondShip) {
    shipsRemaining -= 1;
    if (shipsRemaining === 1) {
      console.log(`Hit! You have sunk a battleship. 1 ship remaining.`);
    } else {
      console.log(`You have destroyed all battleships!`)
    }
  } else {
    console.log(`You have missed!`);
  }
  if (!guessTracker.includes(guess)) {
    guessTracker.push(guess);
  }
}

function gamePlay(grid) {
  let guess = playerGuess(grid);
  guessResult(guess);
  if (shipsRemaining > 0) {
    return gamePlay(grid);
  } else {
    if (rs.keyInYN(`Would you like to play again?`)) {
      resetGrid();
      return battleship(grid);
    }
  }
}

function battleship(grid) {
  rs.question(`Press any key to start the game!`);
  firstShip = setGrid(grid);
  secondShip = setGrid(grid);
  return gamePlay(grid);
}

battleship(grid);