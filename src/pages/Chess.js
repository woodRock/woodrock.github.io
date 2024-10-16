import React, { useState } from 'react';

const BOARD_SIZE = 400;
const SQUARE_SIZE = BOARD_SIZE / 8;

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const pieceComponents = {
  'k': (
    <path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5H9.59c1.47-1.16 2.41-2.97 2.41-5 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 3.31 2.69 6 6 6h14c3.31 0 6-2.69 6-6 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4zm-7 9.5c0 .83-.67 1.5-1.5 1.5S12 19.33 12 18.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm1.5-4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  ),
  'q': (
    <path d="M18 3a3 3 0 1 1-2.83 4h-2.34a3 3 0 1 1-5.66 0H4.83a3 3 0 1 1-2.83-4h16zm4 13v3H2v-3h20z" />
  ),
  'r': (
    <path d="M21 18v3H3v-3h18zm-9-2v-4h-4v4h4zm2 0h4v-4h-4v4zm-8 0h4v-4H6v4zm11-8h4V4h-4v4zm0 2v4h4v-4h-4zM6 4v4h4V4H6zm5 0v4h4V4h-4z" />
  ),
  'b': (
    <path d="M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.72V7H9c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v7h18v-7c0-1.1-.9-2-2-2h-2V9c0-1.1-.9-2-2-2h-2V5.72c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2z" />
  ),
  'n': (
    <path d="M19 22H5v-2h14v2M13 2c-1.65 0-3 1.35-3 3h2c0-.55.45-1 1-1s1 .45 1 1-1 2-2 3c-1.26 1.26-2 2.86-2 4.5V14h6v-1c0-1.1-.9-2-2-2h-1v-1c1.1 0 2-.9 2-2V7c1.1 0 2-.9 2-2V3c0-.55-.45-1-1-1z" />
  ),
  'p': (
    <circle cx="12" cy="12" r="8" />
  ),
};

function Piece({ type, color, x, y, onDragStart }) {
  const fill = color === 'white' ? '#fff' : '#000';
  const stroke = color === 'white' ? '#000' : '#fff';
  
  return (
    <g
      transform={`translate(${x * SQUARE_SIZE + SQUARE_SIZE / 2}, ${y * SQUARE_SIZE + SQUARE_SIZE / 2})`}
      fill={fill}
      stroke={stroke}
      strokeWidth="1"
      draggable="true"
      onDragStart={(e) => onDragStart(e, x, y)}
      style={{ cursor: 'grab' }}
    >
      <g transform="scale(0.8) translate(-12, -12)">
        {pieceComponents[type.toLowerCase()]}
      </g>
    </g>
  );
}

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [dragStart, setDragStart] = useState(null);

  const handleDragStart = (e, x, y) => {
    setDragStart({ x, y });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, x, y) => {
    e.preventDefault();
    if (dragStart) {
      const newBoard = board.map(row => [...row]);
      newBoard[y][x] = newBoard[dragStart.y][dragStart.x];
      newBoard[dragStart.y][dragStart.x] = null;
      setBoard(newBoard);
      setDragStart(null);
    }
  };

  return (
    <svg width={BOARD_SIZE} height={BOARD_SIZE}>
      {board.map((row, y) =>
        row.map((piece, x) => (
          <rect
            key={`${x}-${y}`}
            x={x * SQUARE_SIZE}
            y={y * SQUARE_SIZE}
            width={SQUARE_SIZE}
            height={SQUARE_SIZE}
            fill={(x + y) % 2 === 0 ? '#f0d9b5' : '#b58863'}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, x, y)}
          />
        ))
      )}
      {board.map((row, y) =>
        row.map((piece, x) =>
          piece ? (
            <Piece
              key={`piece-${x}-${y}`}
              type={piece}
              color={piece.toUpperCase() === piece ? 'white' : 'black'}
              x={x}
              y={y}
              onDragStart={handleDragStart}
            />
          ) : null
        )
      )}
    </svg>
  );
}