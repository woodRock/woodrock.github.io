// GoBoard.js
import React, { useState, useEffect, useRef} from 'react';
import './Go.css';

const BOARD_SIZE = 19;
const CELL_SIZE = 30;
const STONE_SIZE = 28;
const STAR_POINT_SIZE = 8;
const DEFAULT_KOMI = 6.5;
const LABEL_OFFSET = 25; // Offset for grid labels

const GoBoard = () => {
  const EMPTY_BOARD = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  const [boardHistory, setBoardHistory] = useState([EMPTY_BOARD]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [koPoint, setKoPoint] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(null);
  const [territory, setTerritory] = useState(null); 
  const [komi, setKomi] = useState(DEFAULT_KOMI);
  const fileInputRef = useRef(null);

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
      setMessage("Self-capture is not allowed.");
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
    setScore(null);
    setTerritory(null);
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
      setKoPoint(null);
      setScore(null);
      setTerritory(null);
    }
  };

  const redo = () => {
    if (currentStep < boardHistory.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
      setKoPoint(null);
      setScore(null);
      setTerritory(null);
    }
  };

  const undoAll = () => {
    setCurrentStep(0);
    setCurrentPlayer('black');
    setKoPoint(null);
    setScore(null);
    setTerritory(null);
  };

  const redoAll = () => {
    setCurrentStep(boardHistory.length - 1);
    setCurrentPlayer(boardHistory.length % 2 === 0 ? 'black' : 'white');
    setKoPoint(null);
    setScore(null);
    setTerritory(null);
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
    setScore(null);
    setTerritory(null);
  };

  const calculateScore = () => {
    const newTerritory = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    const visited = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));

    const floodFill = (row, col) => {
      if (!isValidPosition(row, col) || visited[row][col]) return { black: 0, white: 0, neutral: 0 };
      visited[row][col] = true;

      if (currentBoard[row][col] === 'black') return { black: 1, white: 0, neutral: 0 };
      if (currentBoard[row][col] === 'white') return { black: 0, white: 1, neutral: 0 };

      let result = { black: 0, white: 0, neutral: 1 };
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      
      for (const [dx, dy] of directions) {
        const nextResult = floodFill(row + dx, col + dy);
        result.black += nextResult.black;
        result.white += nextResult.white;
        result.neutral += nextResult.neutral;
      }

      return result;
    };

    let blackTerritory = 0;
    let whiteTerritory = 0;
    let blackStones = 0;
    let whiteStones = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!visited[row][col]) {
          const result = floodFill(row, col);
          if (result.black > 0 && result.white === 0) {
            blackTerritory += result.neutral;
            for (let i = 0; i < BOARD_SIZE; i++) {
              for (let j = 0; j < BOARD_SIZE; j++) {
                if (visited[i][j] && newTerritory[i][j] === null && currentBoard[i][j] === null) {
                  newTerritory[i][j] = 'black';
                }
              }
            }
          } else if (result.white > 0 && result.black === 0) {
            whiteTerritory += result.neutral;
            for (let i = 0; i < BOARD_SIZE; i++) {
              for (let j = 0; j < BOARD_SIZE; j++) {
                if (visited[i][j] && newTerritory[i][j] === null && currentBoard[i][j] === null) {
                  newTerritory[i][j] = 'white';
                }
              }
            }
          }
          // Reset visited for neutral territory
          for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
              if (newTerritory[i][j] === null) {
                visited[i][j] = false;
              }
            }
          }
        }
        if (currentBoard[row][col] === 'black') blackStones++;
        if (currentBoard[row][col] === 'white') whiteStones++;
      }
    }

    setScore({
      black: blackStones + blackTerritory,
      white: whiteStones + whiteTerritory + komi
    });
    setTerritory(newTerritory);
  };

  const renderBoard = () => {
    const elements = [];

    // Draw board background
    elements.push(
      <rect key="board-bg" x={LABEL_OFFSET} y={LABEL_OFFSET} width={BOARD_SIZE * CELL_SIZE} height={BOARD_SIZE * CELL_SIZE} fill="#DEB887" />
    );

    // Draw grid lines
    for (let i = 0; i < BOARD_SIZE; i++) {
      elements.push(
        <line 
          key={`h${i}`} 
          x1={LABEL_OFFSET + CELL_SIZE/2} 
          y1={LABEL_OFFSET + CELL_SIZE/2 + i * CELL_SIZE} 
          x2={LABEL_OFFSET + CELL_SIZE/2 + (BOARD_SIZE-1) * CELL_SIZE} 
          y2={LABEL_OFFSET + CELL_SIZE/2 + i * CELL_SIZE} 
          className="board-line" 
        />
      );
      elements.push(
        <line 
          key={`v${i}`} 
          x1={LABEL_OFFSET + CELL_SIZE/2 + i * CELL_SIZE} 
          y1={LABEL_OFFSET + CELL_SIZE/2} 
          x2={LABEL_OFFSET + CELL_SIZE/2 + i * CELL_SIZE} 
          y2={LABEL_OFFSET + CELL_SIZE/2 + (BOARD_SIZE-1) * CELL_SIZE} 
          className="board-line" 
        />
      );
    }

    // Draw star points
    const starPointPositions = [3, 9, 15];
    starPointPositions.forEach(row => {
      starPointPositions.forEach(col => {
        elements.push(
          <circle
            key={`star-${row}-${col}`}
            cx={LABEL_OFFSET + CELL_SIZE/2 + col * CELL_SIZE}
            cy={LABEL_OFFSET + CELL_SIZE/2 + row * CELL_SIZE}
            r={STAR_POINT_SIZE/2}
            className="star-point"
          />
        );
      });
    });

    // Draw grid labels
    for (let i = 0; i < BOARD_SIZE; i++) {
      // Letter labels (A-T, skipping I)
      const letter = String.fromCharCode(65 + (i >= 8 ? i + 1 : i));
      elements.push(
        <text
          key={`label-${letter}`}
          x={LABEL_OFFSET + CELL_SIZE/2 + i * CELL_SIZE}
          y={LABEL_OFFSET - 5}
          textAnchor="middle"
          className="grid-label"
        >
          {letter}
        </text>
      );

      // Number labels (1-19)
      elements.push(
        <text
          key={`label-${19-i}`}
          x={LABEL_OFFSET - 5}
          y={LABEL_OFFSET + CELL_SIZE/2 + i * CELL_SIZE}
          textAnchor="end"
          dominantBaseline="central"
          className="grid-label"
        >
          {19 - i}
        </text>
      );
    }

    // Draw territory
    if (territory) {
      territory.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            elements.push(
              <rect
                key={`territory-${rowIndex}-${colIndex}`}
                x={LABEL_OFFSET + colIndex * CELL_SIZE}
                y={LABEL_OFFSET + rowIndex * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                className={`territory ${cell}`}
              />
            );
          }
        });
      });
    }

    // Draw stones
    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          elements.push(
            <circle
              key={`${rowIndex}-${colIndex}`}
              cx={LABEL_OFFSET + CELL_SIZE/2 + colIndex * CELL_SIZE}
              cy={LABEL_OFFSET + CELL_SIZE/2 + rowIndex * CELL_SIZE}
              r={STONE_SIZE/2}
              className={`stone ${cell}`}
            />
          );
        }
      });
    });

    return elements;
  };

  const exportSGF = () => {
    let sgf = "(;FF[4]\nGM[1]\nSZ[19]\n";
    sgf += `KM[${komi}]\n`;
    
    for (let i = 1; i < boardHistory.length; i++) {
      const prevBoard = boardHistory[i - 1];
      const currentBoard = boardHistory[i];
      const color = i % 2 === 1 ? 'B' : 'W';
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (prevBoard[row][col] !== currentBoard[row][col] && currentBoard[row][col] !== null) {
            const x = String.fromCharCode(97 + col);
            const y = String.fromCharCode(97 + row);
            sgf += `;${color}[${x}${y}]`;
          }
        }
      }
    }
    
    sgf += ")";
    
    const blob = new Blob([sgf], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game.sgf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSGF = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const sgf = e.target.result;
        const newBoardHistory = parseSGF(sgf);
        setBoardHistory(newBoardHistory);
        setCurrentStep(newBoardHistory.length - 1);
        setCurrentPlayer(newBoardHistory.length % 2 === 0 ? 'black' : 'white');
        setScore(null);
        setTerritory(null);
      };
      reader.readAsText(file);
    }
  };

  const parseSGF = (sgf) => {
    const newBoardHistory = [EMPTY_BOARD];
    const moves = sgf.match(/;([BW])\[([a-s]{2})\]/g) || [];
    
    moves.forEach(move => {
      const color = move[1] === 'B' ? 'black' : 'white';
      const x = move.charCodeAt(3) - 97;
      const y = move.charCodeAt(4) - 97;
      
      const newBoard = newBoardHistory[newBoardHistory.length - 1].map(row => [...row]);
      newBoard[y][x] = color;
      
      // Handle captures
      const capturedStones = getCapturedStones(newBoard, y, x);
      capturedStones.forEach(([capturedY, capturedX]) => {
        newBoard[capturedY][capturedX] = null;
      });
      
      // Check for self-capture
      if (isSelfCapture(newBoard, y, x)) {
        newBoard[y][x] = null;
      }
      
      newBoardHistory.push(newBoard);
    });
    
    return newBoardHistory;
  };

  const getCapturedStones = (board, row, col) => {
    const currentColor = board[row][col];
    const opponentColor = currentColor === 'black' ? 'white' : 'black';
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const capturedStones = [];
    
    directions.forEach(([dy, dx]) => {
      const newRow = row + dy;
      const newCol = col + dx;
      if (isValidPosition(newRow, newCol) && board[newRow][newCol] === opponentColor) {
        const group = [];
        if (!hasLiberty(board, newRow, newCol, opponentColor, new Set(), group)) {
          capturedStones.push(...group);
        }
      }
    });
    const LABEL_OFFSET = 15; // Offset for grid labels
    return capturedStones;
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
        <button onClick={calculateScore}>Calculate Score</button>
        <button onClick={exportSGF} title="Export SGF">&#8599;</button>
        <button onClick={() => fileInputRef.current.click()} title="Import SGF">&#8593;</button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{display: 'none'}} 
          onChange={importSGF} 
          accept=".sgf"
        />
      </div>
      <div className="go-board">
        <svg width={BOARD_SIZE * CELL_SIZE + LABEL_OFFSET * 2} height={BOARD_SIZE * CELL_SIZE + LABEL_OFFSET * 2}>
          {renderBoard()}
          {currentBoard.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <rect
                key={`click-${rowIndex}-${colIndex}`}
                x={LABEL_OFFSET + colIndex * CELL_SIZE}
                y={LABEL_OFFSET + rowIndex * CELL_SIZE}
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
      {score && (
        <div className="score">
          <h2>Score</h2>
          <p>Black: {score.black}</p>
          <p>White: {score.white}</p>
        </div>
      )}
    </div>
  );
};

export default GoBoard;