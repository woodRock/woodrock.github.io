import React, { useState } from 'react';
import './go.css';

const BOARD_SIZE = 19;
const CELL_SIZE = 30;
const STONE_SIZE = 28;

const GoBoard = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('black');

  const handleIntersectionClick = (row, col) => {
    if (board[row][col] === null) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    }
  };

  const renderBoard = () => {
    const lines = [];
    const stones = [];

    // Draw lines
    for (let i = 0; i < BOARD_SIZE; i++) {
      lines.push(
        <line key={`h${i}`} x1={CELL_SIZE/2} y1={CELL_SIZE/2 + i * CELL_SIZE} x2={CELL_SIZE/2 + (BOARD_SIZE-1) * CELL_SIZE} y2={CELL_SIZE/2 + i * CELL_SIZE} className="board-line" />
      );
      lines.push(
        <line key={`v${i}`} x1={CELL_SIZE/2 + i * CELL_SIZE} y1={CELL_SIZE/2} x2={CELL_SIZE/2 + i * CELL_SIZE} y2={CELL_SIZE/2 + (BOARD_SIZE-1) * CELL_SIZE} className="board-line" />
      );
    }

    // Draw stones
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          stones.push(
            <circle
              key={`${rowIndex}-${colIndex}`}
              cx={CELL_SIZE/2 + colIndex * CELL_SIZE}
              cy={CELL_SIZE/2 + rowIndex * CELL_SIZE}
              r={STONE_SIZE/2}
              className={`stone ${cell}`}
            />
          );
        }
      });
    });

    return [...lines, ...stones];
  };

  return (
    <div className="go-container">
      <h1 className="go-title">Go Board</h1>
      <div className="go-board">
        <svg width={BOARD_SIZE * CELL_SIZE} height={BOARD_SIZE * CELL_SIZE}>
          {renderBoard()}
          {/* Clickable areas */}
          {board.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <rect
                key={`click-${rowIndex}-${colIndex}`}
                x={colIndex * CELL_SIZE}
                y={rowIndex * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                className="clickable-area"
                onClick={() => handleIntersectionClick(rowIndex, colIndex)}
              />
            ))
          )}
        </svg>
      </div>
      <p className="current-player">Current player: <span className="player-name">{currentPlayer}</span></p>
    </div>
  );
};

export default GoBoard;