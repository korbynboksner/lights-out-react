import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      initialBoard[i] = [];
      for (let j = 0; j < ncols; j++) {
        initialBoard[i][j] = Math.random() < chanceLightStartsOn;
      }
    }
    return initialBoard;
  }

  function hasWon() {
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (!board[i][j]) {
          return false; 
        }
      }
    }
    return true; 
  
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = oldBoard.map(row => [...row]);

      // Flip the specified cell
      flipCell(y, x, boardCopy);
  
      // Flip the cells around it (up, down, left, right)
      flipCell(y - 1, x, boardCopy); // Up
      flipCell(y + 1, x, boardCopy); // Down
      flipCell(y, x - 1, boardCopy); // Left
      flipCell(y, x + 1, boardCopy); // Right
  
      // Return the copy
      return boardCopy;
    });
  }

  if (hasWon()) {
    return <div>You Won</div>;
  }

  // make table board

  let tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
          <Cell
              key={coord}
              isLit={board[y][x]}
              flipCellsAroundMe={evt => flipCellsAround(coord)}
          />,
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
  );
}

export default Board;
