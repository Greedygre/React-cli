import React, {Component} from "react";
import {connect} from "umi";
import styles from './index.less';
import {GridContent, PageHeaderWrapper} from "@ant-design/pro-layout";
import {message} from "antd";
import {json} from "express";
import g from '../global.js'
import GoEasy from 'goeasy';
var gameChannel = 'default';
var that = null;
var userName = 'default';
var userANick = 'default';
var startGameOnlyOne = 0;
g.goEasy = new GoEasy({
  host: 'hangzhou.goeasy.io',//应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
  appkey: "BC-6ffc39fa9de840079599baf44bfe1c50",//替换为您的应用appkey
  onConnected: function () {
    console.log('连接成功！')
  },
  onDisconnected: function () {
    //连接断开时调用后端方法
    console.log('连接断开！')
  },
  onConnectFailed: function (error) {
    console.log('连接失败或错误！')
  }
});

const dd = props => {
  const {userLogin} = props;
  console.log(userLogin);
  console.log('props');

  console.log(props);

  const req = '/server/api/game/getGameChannel?userName='+userLogin.data.name;
  userName=userLogin.data.name;
  fetch(req).then(response=>{
    return response.json()
  }).then((respone)=>{
    if (respone.success){
      gameChannel=respone.data;
    }else {
      message.info(respone.message);
    }

  })
  return (
    <div>
      <Game/>

    </div>

  )
}

function Square(props) {

  return (
    // <button style={{background: '#fff', width: '100px', height: '100px', border: '1px solid #999',padding:'0',
    //       marginLeft: '213',margin: '-1px'}} className="square" onClick={props.onClick}>
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
      // user1:userLogin.data.name
    };
    g.goEasy.subscribe({
      channel: "lulala@@吨吨吨",// 对局的channel为对战玩家的昵称
      onMessage: function (msg) {
        console.log('revGameMessage');
        console.log(msg);
        //订阅棋盘管道并更新棋盘
        revGameMessage(msg);
      }
    });
    const revGameMessage = (message) => {
      console.log('========================')
      console.log(message)
      const c = JSON.parse(message.content);
      console.log(c)
      this.updateHistory(c);
    }

  }
  updateHistory(gameDO) {
    console.log('updateHistory');
    console.log(this.state);
    const history = JSON.parse(gameDO.checkerBoard);
    console.log(history);
    console.log(history.history.length);
    this.setState({
      history:history.history,
      stepNumber: history.history.length-1,
      xIsNext: gameDO.gameTurn==='x'
    });
  }
  //从数据库取出来返回的
  updateHistory2(gameDO) {
    console.log('updateHistory2');
    console.log(this.state);
    const gg=JSON.parse(gameDO);
    console.log(gg);
    userANick=gg.userANick;
    const history = JSON.parse(gg.checkerBoard);
    if (JSON.stringify(history.history)!==JSON.stringify(this.state.history)){
      console.log(history);
      console.log(history.length);
      console.log(typeof gg.gameTurn);
      console.log(typeof "x");
      console.log(gg.gameTurn==="x");

      this.setState({
        history:history.history,
        stepNumber: history.history.length-1,
        xIsNext: gg.gameTurn==="x"
      });
    }

  }
  handleClick(i) {
    if ((userName===userANick&&!this.state.xIsNext)||(userName!==userANick&&this.state.xIsNext)){
        message.info("当前不是你的轮次");
      }else {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        const {userLogin} = this.props;
        console.log('history');
        console.log(history);
        const req = '/server/api/game/updateGame';
        fetch(req, {
          method: 'post',//改成post
          mode: 'cors',//跨域
          headers: {//请求头
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'userName='+userName+'&history='+JSON.stringify({
            history: history.concat([
              {
                squares: squares
              }
            ])
          })//向服务器发送的数据)
        }).then(response=>{
          return response.json()
        }).then((respone)=>{
          console.log(respone) //请求到的数据
        })
        this.setState({
          history: history.concat([
            {
              squares: squares
            }
          ]),
          stepNumber: history.length,
        });
      }

  }

  jumpTo(step) {
    this.setState({
      watchStepNumber: step,
      watchXIsNext: (step % 2) === 0,
      historyDisplay:'block'
    });

  }

  render() {

      const req = '/server/api/game/initGame?userName='+userName;
      fetch(req).then(response=>{
        return response.json()
      }).then((respone)=>{
        console.log(respone) //请求到的数据
        if (respone.success){
          this.updateHistory2(respone.data);
        }
      })


    that = this;
    console.log(this);
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
      let s = userANick===userName?"x":"o";
      if (s===winner){
        const req = '/server/api/game/settlementScore?userName='+userName+'&win=true';
        fetch(req).then(response=>{
          return response.json()
        }).then((respone)=>{
          if (respone.success){
          }else {
            message.info(respone.message);
          }
        })
      }
      status = "获胜者为: " + winner;
      message.info(status);
    } else if (this.state.stepNumber<9){
      status = "下一位落子: " + (this.state.xIsNext ? "X" : "O");
    }else {
      status = "平局" ;
      const req = '/server/api/game/settlementScore?userName='+userName+'&win=false';
      fetch(req).then(response=>{
        return response.json()
      }).then((respone)=>{
        if (respone.success){
        }else {
          message.info(respone.message);
        }
      })
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

