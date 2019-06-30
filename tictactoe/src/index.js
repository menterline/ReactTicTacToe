import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function WinningSquare(props) {
  return (
    <button className="winning-square">
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
	if (this.props.winners)
	{
		if (this.props.winners.includes(i)) {
			return (<WinningSquare
				value={this.props.squares[i]}/>
			);
		}
	}
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function status(winner, xIsNext) {
  if (winner) {
    return 'Winner: ' + winner;
  } else {
    var nextPlayer = xIsNext ? 'X' : 'O'
    return 'Next player: ' + nextPlayer;
  }
}

function MoveList(props) {
  return (
    <li className="moveList" key={props.move}>
      <button className={"moveButton"} onClick={() => props.onClick(props.move)}>{props.desc}</button>
    </li>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step, currentHistory) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      history: currentHistory.slice(0, step + 1),
    });
  }

  getWinningCharacter(squares, winner)
  {	
	if (winner)
	{
		return squares[winner];
	}
	return null;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <MoveList
          move={move}
          desc={desc}
          currentMoveButton={move}
          onClick={() => this.jumpTo(move, history)} />);
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
			winners={winner}/>
        </div>
        <div className="game-info">
          <div>{status(this.getWinningCharacter(current, winner), this.state.xIsNext)}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
