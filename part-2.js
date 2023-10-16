const rs = require('readline-sync');

let grid = [];
let gridPlacementTracker = [];
let guessTracker = [];
let remainingShips = 5;
let firstShipUnits = 2
let secondShipUnits = 3;
let thirdShipUnits = 3;
let fourthShipUnits = 4;
let fifthShipUnits = 5;

const gridBuilder = (num) => {
  const yAxis = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const yAxisSliced = yAxis.slice(0, num);
  for (let letter of yAxisSliced) {
    const row = []
    for (let x = 1; x <= num; x++) {
      row.push(letter + x);
    }
    grid.push(row);
  }
}

const setShip = (units) => {
  const shipPlacement = [];
  //set random ship location
  const yAxis = gridLocation(grid.length);
  const xAxis = gridLocation(grid.length);
  shipPlacement.push(grid[yAxis][xAxis]);
  //set random ship direction & determine rest of ship location
  shipCoordinates(yAxis, xAxis, units, shipPlacement);
  //check if ship intersects other ships
  for (let ships of gridPlacementTracker) {
    for (let i = 0; i < shipPlacement.length; i++) {
      if (ships.includes(shipPlacement[i])) {
        return setShip(units);
      }
    }
  }
  gridPlacementTracker.push(shipPlacement);
  return shipPlacement;
  }

const gridLocation = (num) => Math.floor(Math.random() * num);

const shipCoordinates = (yAxis, xAxis, units, shipPlacement) => {
    let direction = gridLocation(4);
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
        shipPlacement.push(grid[yAxis][xAxis - i]);
      } else {
        return shipCoordinates(yAxis, xAxis, units, shipPlacement); 
      }
  }
  return shipPlacement;
}

const playerGuess = () => {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: grid,
    limitMessage: `That is not a valid location`,
    caseSensitive: true
  });
}

const guessResult = (guess) => {
  const [first, second, third, fourth, fifth] = gridPlacementTracker;
  if (guessTracker.includes(guess)) {
    console.log(`You have already picked this location. Miss!`);
  } else if (first.includes(guess)) {
      firstShipUnits = hitShip(firstShipUnits);
  } else if (second.includes(guess)) {
      secondShipUnits = hitShip(secondShipUnits);
  } else if (third.includes(guess)) {
      thirdShipUnits = hitShip(thirdShipUnits);
  } else if (fourth.includes(guess)) {
      fourthShipUnits = hitShip(fourthShipUnits);
  } else if (fifth.includes(guess)) {
      fifthShipUnits = hitShip(fifthShipUnits);
  } else {
      console.log(`Miss!`);
  }
  if (!guessTracker.includes(guess)) {
    guessTracker.push(guess);
  }
  return remainingShips;
}

const hitShip = (shipUnits) => {
  shipUnits -= 1;
  shipUnits === 0 ? sunkenShip() : console.log(`Hit!`);
  return shipUnits;
}

const sunkenShip = () => {
  remainingShips -= 1;
  remainingShips === 1 ? console.log(`Hit! You have sunk a battleship. You have ${remainingShips} remaining ship.`) 
                       : console.log(`Hit! You have sunk a battleship. You have ${remainingShips} remaining ships.`);
  return remainingShips;
}

const resetGrid = () => {
  grid = [];
  gridPlacementTracker = [];
  guessTracker = [];
  remainingShips = 5;
  firstShipUnits = 2
  secondShipUnits = 3;
  thirdShipUnits = 3;
  fourthShipUnits = 4;
  fifthShipUnits = 5;
  return battleship();
}

const gamePlay = () => {
  let guess = playerGuess();
  let ships = guessResult(guess);
  if (ships === 0) {
    if (rs.keyInYN(`You have destroyed all battleships. Would you like to play again?`)) {
      return resetGrid();
    }
  } else {
    return gamePlay();
  }
}

const battleship = () => {
  rs.keyIn(`Press any key to start the game!`);
  gridBuilder(10);
  console.log(setShip(2));
  console.log(setShip(3));
  console.log(setShip(3));
  console.log(setShip(4));
  console.log(setShip(5));
                                                                         
  return gamePlay();
}

battleship();
