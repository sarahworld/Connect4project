/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {

  constructor(player1, player2, WIDTH=8, HEIGHT=9){

    this.players = [player1,player2];
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.currPlayer = player1;
    this.makeBoard();
    this.makeHtmlBoard();
    let gameOver = false;
   
  }
  // addevents(){
  //   const reset = document.querySelector('#reset');
  //   reset.addEventListener('click', this.start);
  // }

  // start(){
  //   console.log('START GAME!');
  //   makeBoard();
  //   this.makeHtmlBoard();

  //   let filled = document.querySelectorAll('td div');
  //   for(let item of filled){
  //     item.remove();
  //   }


  // }

  makeBoard() {
    this.board = [];
    //    let filled = document.querySelectorAll('td div');
    // for(let item of filled){
    //   item.remove();
    // }

    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.handleSpotClick = this.handleClick.bind(this);

    top.addEventListener('click', this.handleSpotClick);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    boardElement.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {

        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      boardElement.append(row);
    }
  }

  findSpotForCol(x){
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable = (y, x) => {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame = (msg) => {
    alert(msg);
    const top = document.querySelector('#column top');
    top.removeEventListener('click', this.handleSpotClick);
  }

  handleClick = (evt) => {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
  
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0]? this.players[1] : this.players[0];
  }


  checkForWin = () =>{
    this._win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
  
}

class player {
  constructor(color){
    this.color = color;
  }
}

document.getElementById('reset').addEventListener('click',() => {
  const player1 = new player(document.getElementById('player1').value);
  const player2 = new player(document.getElementById('player2').value);
  new Game(player1,player2);
});


