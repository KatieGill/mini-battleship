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
  for (let letter of yAxisSliced) {
    let row = []
    for (let x = 1; x <= num; x++) {
      row.push(letter + x);
    }
    grid.push(row);
  }
}

function setShip(grid, units, gridPlacementTracker) {
  const shipPlacement = [];
  let availableGrid = [];
  
  //set random ship location
  let yAxis = gridLocation(grid);
  let xAxis = gridLocation(grid);
  shipPlacement.push(grid[yAxis][xAxis]);
 
  //set random ship direction on available grid
  //determine rest of ship location
  shipCoordinates(grid, yAxis, xAxis, units, shipPlacement);

  //check if ship intersects other ships
  for (let ships of gridPlacementTracker) {
    for (let i = 0; i < shipPlacement.length; i++) {
      if (ships.includes(shipPlacement[i])) {
        return setShip(grid, units, gridPlacementTracker);
      }
    }
  }
  gridPlacementTracker.push(shipPlacement);
  return shipPlacement;
  }

function shipCoordinates(grid, yAxis, xAxis, units, shipPlacement) {
    let direction = Math.floor(Math.random() * 4);
    for (let i = 1; i < units; i++) {
      if (direction === 0 && (yAxis + 1) >= units) {
        //up
        shipPlacement.push(grid[yAxis - i][xAxis]);
      } else if (direction === 1 && (grid.length - xAxis) >= units) {
        //right
        shipPlacement.push(grid[yAxis][xAxis + i]);
      } else if (direction === 2 && (grid.length - yAxis) >= units) {
        //down
        shipPlacement.push(grid[yAxis + i][xAxis]);
      } else if (direction === 3 && (xAxis + 1) >= units) {
       //left
       shipPlacement.push(grid[yAxis][xAxis - i])
      } else {
        return shipCoordinates(grid, yAxis, xAxis, units, shipPlacement); 
      }
  }
  return shipPlacement;
}


function gridLocation(grid) {
  return Math.floor(Math.random() * grid.length);
}



function resetGrid() {
  grid = [];
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
  firstShip = setShip(grid, 2, gridPlacementTracker);
  console.log(`ship: ${firstShip}`);
  secondShip = setShip(grid, 3, gridPlacementTracker);
  console.log(`ship: ${secondShip}`);
  thirdShip = setShip(grid, 3, gridPlacementTracker);
  console.log(`ship: ${thirdShip}`);
  fourthShip = setShip(grid, 4, gridPlacementTracker);
  console.log(`ship: ${fourthShip}`);
  fifthShip = setShip(grid, 5, gridPlacementTracker);
  console.log(`ship: ${fifthShip}`);
  return gamePlay(grid);
}

battleship(grid);
