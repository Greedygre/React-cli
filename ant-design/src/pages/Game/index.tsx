import React, {Component} from "react";
import {connect} from "umi";
import styles from './index.less';
import {GridContent, PageHeaderWrapper} from "@ant-design/pro-layout";
import {message} from "antd";

const dd = (props) => {
  return (
    <div>
      <Game/>

    </div>

  )
}

function Square(props) {

  return (
    // <button style={{background: '#fff', width: '100px', height: '100px', border: '1px solid #999',padding:'0',
    //     //   marginLeft: '213',margin: '-1px'}} className="square" onClick={props.onClick}>
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div >

        <div className={styles.boardRow} >
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className={styles.boardRow}>

          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className={styles.boardRow}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
class HBoard extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
      />
    );
  }

  render() {
    return (
      <div>

        <div className={styles.boardRow}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className={styles.boardRow}>

          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className={styles.boardRow}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    const {myLogin} = props;
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      watchHistory:[],
      watchStepNumber: 0,
      watchXIsNext: true,
      historyDisplay:'none'
      // user1:myLogin.data.name
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      watchStepNumber: step,
      watchXIsNext: (step % 2) === 0,
      historyDisplay:'block'
    });

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const watchHistory=history[this.state.watchStepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        '查看第' + move+'步' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "获胜者为: " + winner;
      message.info(status);
    } else {
      status = "下一位落子: " + (this.state.xIsNext ? "X" : "O");
    }

    return (

      <div className={styles.game}>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className={styles.gameInfo}>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div  style={{display: this.state.historyDisplay}}>
          <HBoard
            squares={watchHistory.squares}
          />
        </div>
      </div>
    );
  }
}

// ========================================


function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default connect(({myLogin, loading}) => ({
  userLogin: myLogin,
  submitting: loading.effects['myLogin/fetchLoginUser'],
}))(dd);
