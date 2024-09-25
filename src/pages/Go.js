// GoBoard.js
import React, { useState, useEffect } from 'react';
import './Go.css';

const BOARD_SIZE = 19;
const CELL_SIZE = 30;
const STONE_SIZE = 28;
const STAR_POINT_SIZE = 8;

const GoBoard = () => {
  const EMPTY_BOARD = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  const [boardHistory, setBoardHistory] = useState([EMPTY_BOARD]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [koPoint, setKoPoint] = useState(null);
  const [message, setMessage] = useState('');

  const currentBoard = boardHistory[currentStep];

  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleIntersectionClick = (row, col) => {
    if (currentBoard[row][col] !== null) return;
    
    if (isKoPoint(row, col)) {
      setMessage("Ko rule violation. Cannot place stone here.");
      return;
    }

    const newBoard = currentBoard.map(row => [...row]);
    newBoard[row][col] = currentPlayer;

    const capturedStones = captureStones(newBoard, row, col);
    const selfCapture = isSelfCapture(newBoard, row, col);
    
    if (selfCapture && capturedStones.length === 0) {
      setMessage("Self-capture without capturing opponent stones is not allowed.");
      return;
    }

    if (selfCapture) {
      removeCapturedStones(newBoard, row, col);
    }

    if (capturedStones.length === 1 && !selfCapture) {
      setKoPoint(capturedStones[0]);
    } else {
      setKoPoint(null);
    }

    const newHistory = boardHistory.slice(0, currentStep + 1);
    setBoardHistory([...newHistory, newBoard]);
    setCurrentStep(currentStep + 1);
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
      setKoPoint(null);
    }
  };

  const redo = () => {
    if (currentStep < boardHistory.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
      setKoPoint(null);
    }
  };

  const undoAll = () => {
    setCurrentStep(0);
    setCurrentPlayer('black');
    setKoPoint(null);
  };

  const redoAll = () => {
    setCurrentStep(boardHistory.length - 1);
    setCurrentPlayer(boardHistory.length % 2 === 0 ? 'black' : 'white');
    setKoPoint(null);
  };

  const isKoPoint = (row, col) => {
    return koPoint && koPoint[0] === row && koPoint[1] === col;
  };

  const isSelfCapture = (board, row, col) => {
    const group = [];
    return !hasLiberty(board, row, col, board[row][col], new Set(), group);
  };

  const captureStones = (board, row, col) => {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const capturedStones = [];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (isValidPosition(newRow, newCol) && board[newRow][newCol] === opponent) {
        const group = [];
        if (!hasLiberty(board, newRow, newCol, opponent, new Set(), group)) {
          group.forEach(([x, y]) => {
            board[x][y] = null;
            capturedStones.push([x, y]);
          });
        }
      }
    });

    return capturedStones;
  };

  const removeCapturedStones = (board, row, col) => {
    const group = [];
    hasLiberty(board, row, col, board[row][col], new Set(), group);
    group.forEach(([x, y]) => {
      board[x][y] = null;
    });
  };

  const hasLiberty = (board, row, col, color, visited, group) => {
    const key = `${row},${col}`;
    if (visited.has(key)) return false;
    visited.add(key);

    if (!isValidPosition(row, col)) return false;
    if (board[row][col] === null) return true;
    if (board[row][col] !== color) return false;

    group.push([row, col]);

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return directions.some(([dx, dy]) => 
      hasLiberty(board, row + dx, col + dy, color, visited, group)
    );
  };

  const isValidPosition = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  const resetBoard = () => {
    setBoardHistory([EMPTY_BOARD]);
    setCurrentStep(0);
    setCurrentPlayer('black');
    setKoPoint(null);
    setMessage('');
  };

  const renderBoard = () => {
    const lines = [];
    const stones = [];
    const starPoints = [];

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
    currentBoard.forEach((row, rowIndex) => {
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

    // Draw star points
    const starPointPositions = [3, 9, 15];
    starPointPositions.forEach(row => {
      starPointPositions.forEach(col => {
        starPoints.push(
          <circle
            key={`star-${row}-${col}`}
            cx={CELL_SIZE/2 + col * CELL_SIZE}
            cy={CELL_SIZE/2 + row * CELL_SIZE}
            r={STAR_POINT_SIZE/2}
            className="star-point"
          />
        );
      });
    });

    return [...lines, ...starPoints, ...stones];
  };

  return (
    <div className="go-container">
      <h1 className="go-title">Go Board</h1>
      <div className="controls">
        <button onClick={resetBoard}>Reset</button>
        <button onClick={undoAll} disabled={currentStep === 0} title="Undo All">&#8676;</button>
        <button onClick={undo} disabled={currentStep === 0} title="Undo">&#8592;</button>
        <button onClick={redo} disabled={currentStep === boardHistory.length - 1} title="Redo">&#8594;</button>
        <button onClick={redoAll} disabled={currentStep === boardHistory.length - 1} title="Redo All">&#8677;</button>
      </div>
      <div className="go-board">
        <svg width={BOARD_SIZE * CELL_SIZE} height={BOARD_SIZE * CELL_SIZE}>
          {renderBoard()}
          {/* Clickable areas */}
          {currentBoard.map((row, rowIndex) =>
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
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default GoBoard;