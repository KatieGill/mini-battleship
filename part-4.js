const rs = require('readline-sync');


function Player(name, opponent) {
  this.name = name;
  this.grid = [];
  this.gridPlacementTracker = [];
  this.guessTracker = [];
  this.remainingShips = 5;
  this.firstShipUnits = 2;
  this.secondShipUnits = 3;
  this.thirdShipUnits = 3;
  this.fourthShipUnits = 4;
  this.fifthShipUnits = 5;
  this.isOpponent = opponent;
}

const gridBuilder = (num, grid) => {
  for (let i = 0; i < num; i++) {
    const yAxis = [];
    for (let j = 0; j < num; j++) {
      yAxis.push([`____|`])
    }
    grid.push(yAxis);
  }
  return grid;
}

const printGrid = (player) => {
  const xHEaders = setHeaders(player.grid.length);
  console.log(xHEaders);
  for (let i = 0; i < player.grid.length; i++) {
    const yHeaders = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    let row = `${yHeaders[i]}  |`;
    for (let cell of player.grid[i]) {
      if (player.isOpponent) {
        cell === '__S_|' ? row += `____|` : row += `${cell}`;
      } else {
        row += `${cell}`;
      }
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

const setShip = (units, player) => {
  const shipPlacement = [];
  //set random ship location
  const yAxis = gridLocation(player.grid.length);
  const xAxis = gridLocation(player.grid.length);
  shipPlacement.push([yAxis, xAxis]);
  //set random ship direction & determine rest of ship location
  shipCoordinates(units, player, shipPlacement, yAxis, xAxis);
  //check if ship intersects other ships & place ship
  placementValidator(units, player, shipPlacement);
  }

const gridLocation = (num) => Math.floor(Math.random() * num);

const shipCoordinates = (units, player, shipPlacement, yAxis, xAxis) => {
  let direction = gridLocation(4);
  for (let i = 1; i < units; i++) {
    if (direction === 0 && (yAxis + 1) >= units) {
      //up
      shipPlacement.push([yAxis - i, xAxis]);
    } else if (direction === 1 && (player.grid.length - xAxis) >= units) {
      //right
      shipPlacement.push([yAxis, xAxis + i]);
    } else if (direction === 2 && (player.grid.length - yAxis) >= units) {
      //down
      shipPlacement.push([yAxis + i, xAxis]);
    } else if (direction === 3 && (xAxis + 1) >= units) {
      //left
      shipPlacement.push([yAxis, xAxis - i]);
    } else {
      return shipCoordinates(units, player, shipPlacement, yAxis, xAxis); 
    }
  }
  return shipPlacement;
}

const placementValidator = (units, player, shipPlacement) => {
  for (let ship of player.gridPlacementTracker) {
    for (let coordinate of ship) {
      const [y, x] = coordinate;
      for (let j = 0; j < shipPlacement.length; j++) {
        const [yAxis, xAxis] = shipPlacement[j];
        if (y == yAxis && x == xAxis) {
          return setShip(units, player);
        }
      }
    }
  }
  player.gridPlacementTracker.push(shipPlacement);
  return assignShipCells(shipPlacement, player);
}

const assignShipCells = (shipPlacement, player) => {
  for (let i = 0; i < shipPlacement.length; i++) {
    const [yAxis, xAxis] = shipPlacement[i];
    player.grid[yAxis][xAxis] = '__S_|';
  }
}

const guessLimits = (player) => {
  const yAxis = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const yAxisSliced = yAxis.slice(0, player.grid.length);
  const limit = [];
  for (let letter of yAxisSliced) {
    for (let x = 1; x <= player.grid.length; x++) {
      limit.push(letter + x);
    }
  }
  return limit;
}

const playerGuess = (player) => {
  return rs.question(`Enter a location to strike, i.e. 'A2': `, {
    limit: guessLimits(player),
    limitMessage: `That is not a valid location`,
    caseSensitive: true
  });
}

const computerGuess = (player) => {
  const limit = guessLimits(player);
  const guess = gridLocation(limit.length);
  return limit[guess];
}

const guessResult = (guess, player1, player2) => {
  let coordinates = guessConvert(guess);
  const [y, x] = coordinates;
  const [first, second, third, fourth, fifth] = player2.gridPlacementTracker;
  if (player1.guessTracker.includes(guess) && player1.isOpponent) {
      return gamePlay(player1, player2);
  } else if (player1.guessTracker.includes(guess)) {
      console.log(`${player1.name}, you have already picked this location. Miss!`);
  } else if (shipCheck(first, y, x)){
      player2.firstShipUnits = hitShip(player2.firstShipUnits, y, x, player1, player2);
  } else if (shipCheck(second, y, x)) {
      player2.secondShipUnits = hitShip(player2.secondShipUnits, y, x, player1, player2);
  } else if (shipCheck(third, y, x)) {
      player2.thirdShipUnits = hitShip(player2.thirdShipUnits, y, x, player1, player2);
  } else if (shipCheck(fourth, y, x)) {
      player2.fourthShipUnits = hitShip(player2.fourthShipUnits, y, x, player1, player2);
  } else if (shipCheck(fifth, y, x)) {
      player2.fifthShipUnits = hitShip(player2.fifthShipUnits, y, x, player1, player2);
  } else {
      console.log(`${player1.name}: Miss!`);
      player2.grid[y][x] = '__O_|';
  }
  if (!player1.guessTracker.includes(guess)) {
    player1.guessTracker.push(guess);
  }
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

const hitShip = (shipUnits, y, x, player1, player2) => {
  shipUnits -= 1;
  shipUnits === 0 ? sunkenShip(player1, player2) : console.log(`${player1.name}: Hit!`);
  player2.grid[y][x] = '__X_|';
  return shipUnits;
}

const sunkenShip = (player1, player2) => {
  player2.remainingShips -= 1;
  player2.remainingShips === 1 ? console.log(`Hit! ${player1.name} has sunk a battleship.  ${player2.name} has ${player2.remainingShips} remaining ship.`) 
                       : console.log(`Hit! ${player1.name} has sunk a battleship.  ${player2.name} has ${player2.remainingShips} remaining ships.`);
  return player2.remainingShips;
}

const gamePlay = (player1, player2) => {
  let guess = "";
  if (player1.isOpponent) {
    guess = computerGuess(player1);
  } else {
    guess = playerGuess(player1);
  }
  guessResult(guess, player1, player2);
  if (player2.remainingShips === 0) {
    printGrid(player2);
    printGrid(player1);
    if (rs.keyInYN(`${player1.name} has destroyed all battleships! Would you like to play again?`)) {
      return battleship();
    }
} else {
  printGrid(player2);
  return gamePlay(player2, player1);
}
}

const battleship = () => {
  const playerOne = new Player('Player One', false);
  const computer = new Player('The Computer', true);
  rs.keyIn(`Press any key to start the game!`);
  gridBuilder(10, playerOne.grid);
  setShip(2, playerOne);
  setShip(3, playerOne);
  setShip(3, playerOne);
  setShip(4, playerOne);
  setShip(5, playerOne);
  gridBuilder(10, computer.grid);
  setShip(2, computer);
  setShip(3, computer);
  setShip(3, computer);
  setShip(4, computer);
  setShip(5, computer);
  printGrid(computer);
  printGrid(playerOne);
  return gamePlay(playerOne, computer);
}

battleship();





