const rs = require('readline-sync');

function GameBoard(length, fleetArr) {
  this.gridLength = length;
  this.grid = [];
  this.gridPlacementTracker = [];
  this.guessTracker = [];
  this.fleet = fleetArr;
  this.remainingShips = fleetArr.length;
}

function Ship(units) {
  this.units = units;
  this.coords = [];
}

const gridBuilder = (length, grid) => {
  const yAxis = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const yAxisSliced = yAxis.slice(0, length);
  for (let letter of yAxisSliced) {
    const row = []
    for (let x = 1; x <= length; x++) {
      row.push(letter + x);
    }
    grid.push(row);
  }
}

const fleetBuilder = (fleet) => fleet.map((shipUnits) => new Ship(shipUnits));

const getRandomNumber = (num) => Math.floor(Math.random() * num);

const setShip = (board) => {
    board.fleet.forEach((ship) => {
    const [yAxis, xAxis] = [1, 2].map(() => getRandomNumber(board.grid.length));
    ship.coords.push(board.grid[yAxis][xAxis]);
    shipCoordinates(yAxis, xAxis, ship, board.grid);
    for (let ships of board.gridPlacementTracker) {
      for (let i = 0; i < ship.coords.length; i++) {
        if (ships.includes(ship.coords[i])) {
          return setShip(board);
        }
      }
    }
    board.gridPlacementTracker.push(ship.coords);
    return ship.coords;
  });
  }

const shipCoordinates = (yAxis, xAxis, ship, grid) => {
    let direction = getRandomNumber(4);
    for (let i = 1; i < ship.units; i++) {
      if (direction === 0 && (yAxis + 1) >= ship.units) {
        //up
        ship.coords.push(grid[yAxis - i][xAxis]);
      } else if (direction === 1 && (grid.length - xAxis) >= ship.units) {
        //right
        ship.coords.push(grid[yAxis][xAxis + i]);
      } else if (direction === 2 && (grid.length - yAxis) >= ship.units) {
        //down
        ship.coords.push(grid[yAxis + i][xAxis]);
      } else if (direction === 3 && (xAxis + 1) >= ship.units) {
       //left
        ship.coords.push(grid[yAxis][xAxis - i]);
      } else {
        return shipCoordinates(yAxis, xAxis, ship, grid); 
      }
  }
  return ship;
}

const playerGuess = (guessLimit) => {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: guessLimit,
    limitMessage: `That is not a valid location`,
  });
}

const findHitShip = (guess, fleet) => fleet.find((ship) => ship.coords.includes(guess));

const guessResult = (guess, board) => {
  const shipHit = findHitShip(guess, board.fleet);
  board.guessTracker.includes(guess)
    ? console.log(`You have already picked this location. Miss!`)
    : board.guessTracker.push(guess);
  shipHit ? shipHit.units = hitShip(shipHit.units, board) : console.log(`Miss!`);
  return board.remainingShips;
}

const hitShip = (hitShipUnits, board) => {
  hitShipUnits -= 1;
  hitShipUnits === 0 ? remainingShips = sunkenShip(board) : console.log(`Hit!`);
  return hitShipUnits;
}

const sunkenShip = (board) => {
  board.remainingShips -= 1;
  const tail = board.remainingShips === 1 ? '' : 's';
  console.log(`Hit! You have sunk a battleship. You have ${board.remainingShips} remaining ship${tail}.`);
  return board.remainingShips;
}

const gamePlay = (board) => {
  let guess = playerGuess(board.grid).toUpperCase();
  let ships = guessResult(guess,board);
  if (ships === 0) {
    if (rs.keyInYN(`You have destroyed all battleships. Would you like to play again?`)) {
      return gameStart(10, [2, 3, 3, 4, 5]);
    }
  } else {
    return gamePlay(board);
  }
}

const gameStart = (boardLength, shipUnitsArr) => {
  const board = new GameBoard(boardLength, shipUnitsArr);
  return battleship(board);
}

const battleship = (board) => {
  rs.keyIn(`Press any key to start the game!`);
  gridBuilder(board.gridLength, board.grid);
  board.fleet = fleetBuilder(board.fleet);
  setShip(board);
  console.log(board.fleet);                                                                
  return gamePlay(board);
}

gameStart(10, [2, 3, 3, 4, 5]);
