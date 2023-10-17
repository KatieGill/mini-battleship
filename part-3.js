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
  for (let i = 0; i < num; i++) {
    const yAxis = [];
    for (let j = 0; j < num; j++) {
      yAxis.push([`____|`])
    }
    grid.push(yAxis);
  }
  return grid;
}

const printGrid = () => {
  const xHEaders = setHeaders(grid.length);
  console.log(xHEaders);
  for (let i = 0; i < grid.length; i++) {
    const yHeaders = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    let row = `${yHeaders[i]}  |`;
    for (let cell of grid[i]) {
      cell === '__S_|' ? row += `____|` : row += `${cell}`;
      //row += `${cell}`;
    }
    console.log(row);
  }
}

const setHeaders = (length) => {
  let header = `     `;
  for (let i = 1; i <= length; i++) {
    header += `${i}    `;
  }
  return header;
}

const setShip = (units) => {
  const shipPlacement = [];
  //set random ship location
  const yAxis = gridLocation(grid.length);
  const xAxis = gridLocation(grid.length);
  shipPlacement.push([yAxis, xAxis]);
  //set random ship direction & determine rest of ship location
  shipCoordinates(yAxis, xAxis, units, shipPlacement);
  //check if ship intersects other ships & place ship
  placementValidator(units, gridPlacementTracker, shipPlacement);
  }

const gridLocation = (num) => Math.floor(Math.random() * num);

const shipCoordinates = (yAxis, xAxis, units, shipPlacement) => {
  let direction = gridLocation(4);
  for (let i = 1; i < units; i++) {
    if (direction === 0 && (yAxis + 1) >= units) {
      //up
      shipPlacement.push([yAxis - i, xAxis]);
    } else if (direction === 1 && (grid.length - xAxis) >= units) {
      //right
      shipPlacement.push([yAxis, xAxis + i]);
    } else if (direction === 2 && (grid.length - yAxis) >= units) {
      //down
      shipPlacement.push([yAxis + i, xAxis]);
    } else if (direction === 3 && (xAxis + 1) >= units) {
      //left
      shipPlacement.push([yAxis, xAxis - i]);
    } else {
      return shipCoordinates(yAxis, xAxis, units, shipPlacement); 
    }
  }
  return shipPlacement;
}

const placementValidator = (units, gridPlacementTracker, shipPlacement) => {
  for (let ship of gridPlacementTracker) {
    for (let coordinate of ship) {
      const [y, x] = coordinate;
      for (let j = 0; j < shipPlacement.length; j++) {
        const [yAxis, xAxis] = shipPlacement[j];
        if (y == yAxis && x == xAxis) {
          return setShip(units);
        }
      }
    }
  }
  gridPlacementTracker.push(shipPlacement);
  return assignShipCells(shipPlacement);
}

const assignShipCells = (shipPlacement) => {
  for (let i = 0; i < shipPlacement.length; i++) {
    const [yAxis, xAxis] = shipPlacement[i];
    grid[yAxis][xAxis] = '__S_|';
  }
}

const guessLimits = (length) => {
  const yAxis = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const yAxisSliced = yAxis.slice(0, length);
  const limit = [];
  for (let letter of yAxisSliced) {
    for (let x = 1; x <= length; x++) {
      limit.push(letter + x);
    }
  }
  return limit;
}

const playerGuess = () => {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: guessLimits(grid.length),
    limitMessage: `That is not a valid location`,
    caseSensitive: true
  });
}

const guessResult = (guess) => {
  let coordinates = guessConvert(guess);
  const [y, x] = coordinates;
  const [first, second, third, fourth, fifth] = gridPlacementTracker;
  if (guessTracker.includes(guess)) {
    console.log(`You have already picked this location. Miss!`);
  } else if (shipCheck(first, y, x)){
      firstShipUnits = hitShip(firstShipUnits, y, x);
  } else if (shipCheck(second, y, x)) {
      secondShipUnits = hitShip(secondShipUnits, y, x);
  } else if (shipCheck(third, y, x)) {
      thirdShipUnits = hitShip(thirdShipUnits, y, x);
  } else if (shipCheck(fourth, y, x)) {
      fourthShipUnits = hitShip(fourthShipUnits, y, x);
  } else if (shipCheck(fifth, y, x)) {
      fifthShipUnits = hitShip(fifthShipUnits, y, x);
  } else {
      console.log(`Miss!`);
      grid[y][x] = '__O_|';
  }
  if (!guessTracker.includes(guess)) {
    guessTracker.push(guess);
  }
return printGrid();
}

const guessConvert = (guess) => {
  let y = guess.substring(0, 1);
  let x = guess.substring(1);
  let yAxis = alphaConvert(y);
  let xAxis = x -= 1;
  return [yAxis, xAxis];
}

const alphaConvert = (letter) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet.indexOf(letter);
}

const shipCheck = (ship, y, x) => {
  for (let cell of ship) {
    if (cell[0] === y && cell[1] === x) {
      return true;
    }
  }
  return false;
}

const hitShip = (shipUnits, y, x) => {
  shipUnits -= 1;
  shipUnits === 0 ? sunkenShip() : console.log(`Hit!`);
  grid[y][x] = '__X_|';
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
  guessResult(guess);
  if (remainingShips === 0) {
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
  setShip(2);
  setShip(3);
  setShip(3);
  setShip(4);
  setShip(5);
  printGrid();                                                                     
  return gamePlay();
}

battleship();




