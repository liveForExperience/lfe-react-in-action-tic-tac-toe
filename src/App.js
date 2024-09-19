import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button
          className='square'
          onClick={onSquareClick}
         >
            { value }
         </button>;
}

function Row({ index }) {

}

function Board({xIsNext, squares, onPlay}) {
  function handeClick(i) {
    if (calculateWiner(squares)) {
      return;
    }

    if (squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  const winner = calculateWiner(squares);
  let status = winner ? `Winner: ${winner}` : "Next player: " + (xIsNext ? "X" : "O");

  const table = [];
  for (let i = 0; i < 3; i++) {
    const squareArr = [];
    for (let j = 0; j < 3; j++) {
      squareArr.push(
        <Square value={squares[i * 3 + j]} onSquareClick={() => handeClick(i * 3 + j)}/>
      )
    }

    table.push(
      <div className="board-row">
        {squareArr}
      </div>
    );
  }  
  
  return (
      <>
        <div className="status">{status}</div>
        {table}
      </>
    );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [toggle, setToggle] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquare = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((square, move) => {
    let description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      move != currentMove ? (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      ) : 
      (
        <li key={move}>
          <div >You are at move #{move}</div>
        </li>
      )
    );
  });

  if (!toggle) {
    moves.reverse();
  }

  const sort = <button onClick={() => setToggle(!toggle)}>sort</button>

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquare} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>{sort}</div>
    </div>
  );
}

function calculateWiner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c]) {
      return squares[a];
    }
  }

  return null;
}