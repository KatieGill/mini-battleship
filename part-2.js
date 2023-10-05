const rs = require('readline-sync');
let grid = [];

let gridPlacementTracker = [];
let guessTracker = [];
let shipsRemaining = 2;
let firstShip = "";
let secondShip = "";

function gridBuilder(num) {
  const yAxis = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let yAxisSliced = yAxis.slice(0, num);
  for (let char of yAxisSliced) {
    const xAxis = []
    for (let i = 1; i <= num; i++) {
      xAxis.push(char + i);
    }
    grid.push(xAxis);
  }
}

function setShip(grid, units) {
  let availableGrid = [...grid];
  let shipPlacement = [];
  let shipLength = units;
  const leftGridLimit = /1$/;
  const rightGridLimit = /10/;

  while (shipLength > 0) {
    let gridPlacement = availableGrid[Math.floor(Math.random() * availableGrid.length)][Math.floor(Math.random() * availableGrid.length)];
    if (gridPlacementTracker.includes(gridPlacement)) {
      return setShip(grid, units);
    }
  
  if (leftGridLimit.test(gridPlacement)) {
    availableGrid = availableGrid.slice(availableGrid.indexOf(gridPlacement) - (10), availableGrid.indexOf(gridPlacement) + (10 + 2));
    availableGrid.splice(2, (10 - 2));
    availableGrid.splice(4, (10 - 2));
  } else if (rightGridLimit.test(gridPlacement)) {
    availableGrid = availableGrid.slice(availableGrid.indexOf(gridPlacement) - (10 + 1), availableGrid.indexOf(gridPlacement) + (10 + 1));
    availableGrid.splice(2, (10 - 2));
    availableGrid.splice(4, (10 - 2));
  } else {
    availableGrid = availableGrid.slice(availableGrid.indexOf(gridPlacement) - (10 + 1), availableGrid.indexOf(gridPlacement) + (10 + 2));
    availableGrid.splice(3, (10 - 3));
    availableGrid.splice(6, (10 - 3));
  }

    gridPlacementTracker.push(gridPlacement);
    shipPlacement.push(gridPlacement);
    shipLength -= 1;
  }
  return shipPlacement;
  
}

function resetGrid() {
  grid = [];
  console.log(grid);
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
  rs.keyIn(`Press any key to start the game!`);
  gridBuilder(10);
  firstShip = setShip(grid, 2);
  console.log(firstShip);
  secondShip = setShip(grid, 3);
  console.log(secondShip);
  /*thirdShip = setShip(grid, 3);
  console.log(thirdShip);
  fourthShip = setShip(grid, 4);
  console.log(fourthShip);
  fifthShip = setShip(grid, 5);
  console.log(fifthShip);*/
  return gamePlay(grid);
}

battleship(grid);
