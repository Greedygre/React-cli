import React, {Component} from 'react';
import Chat from 'chat-react';
import {ReactDOM} from 'react';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {history} from "umi";
import {connect} from 'dva'
import {json} from "express";
import {stringify} from "qs";
// 在index.js文件里，引入global.js，并初始化一个全局GoEasy对象
import GoEasy from 'goeasy';
import g from '../global.js'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'

var that = null;
var userName = null;
var chatRoomChannel = 'default';
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
g.goEasy.subscribe({
  channel: chatRoomChannel,// 聊天室的channel为对战玩家的昵称
  onMessage: function (msg) {
    console.log(msg);
    //订阅聊天室管道并更新聊天列表
    revMessage(msg);
  }
});

@connect(({myLogin, myMessage,myChannel, loading}) => ({
  myLogin,
  myMessage,
  myChannel,
}))
export default class MyChat extends Component {
  state = {
    inputValue: '',
    messages: [],
    timestamp: new Date().getTime()
  }
  setInputfoucs = () => {
    this.chat.refs.input.inputFocus();  //set input foucus
  }
  setScrollTop = () => {
    this.chat.refs.message.setScrollTop(1200);  //set scrollTop position
  }
  sendMessage = (v) => {
    g.goEasy.subscribe({
      channel: chatRoomChannel,// 聊天室的channel为对战玩家的昵称
      onMessage: function (msg) {
        console.log(msg);
        //订阅聊天室管道并更新聊天列表
        revMessage(msg);
      }
    });
    //v的内容包含value，时间戳，用户信息
    //value: "😏", timestamp: 1589297437337, userInfo: avatar: "http://img.binlive.cn/6.png"
    // name: "ricky"
    // userId: "a59e454ea53107d66ceb0a59
    g.goEasy.publish({
      channel: chatRoomChannel, //替换为您自己的channel
      message: JSON.stringify({
        value: v.value,
        timestamp: v.timestamp,
        name: v.userInfo.name,
        avatar: v.userInfo.avatar
      })//替换为您想要发送的消息内容
    });

  }


  render() {
    that = this;
     getChatRoom(userName)
    const {myLogin, myMessage} = this.props;
    const {inputValue, messages, timestamp} = this.state;
    const userInfo = {
      avatar: (typeof myLogin.data.pictureAddress != 'undefined') ? myLogin.data.pictureAddress : g.avatar,
      name: myLogin.data.name,
      signature: myLogin.data.signature,
    };
    userName = userInfo.name;
    const Item = List.Item
    //聊天消息
    const chatmsgs = myMessage.messages;

    console.log("chatmsgs");
    console.log(chatmsgs);

    return (
      <div>
        <div>
          <p>聊天室</p>
        </div>
        {/*聊天内容展示部分*/}
        <div id='chat-page'>
          <NavBar
            mode='dark'
            className='chat-top-bar'
            icon={<Icon type="left"/>}
            onLeftClick={() => {
              this.props.history.goBack()
            }}
          >
            {/* 对方的id */}
            {/*{users[userid].name}*/}
            {'聊天室'}
          </NavBar>
          <div className='chat-content'>
            {chatmsgs.map(v => {
              //用户头像
              //const avatar = require(userInfo.avatar)
              var a_str = null;
              if (v.avatar) {
                a_str = v.avatar;
              } else {
                a_str = '62f24a8af50d4f329644275e0efbfbff.jpeg';
              }
              const avatar = require('../img/' + a_str)
              console.log("chat-->msg", v);
              return (
                <List key={v.userNick}>
                  <Item
                    thumb={avatar}
                  >{v.userNick}说：{v.msg}</Item>
                </List>
              )
              // return v.userNick === userInfo.name ? (
              //   <List key={v.userNick}>
              //     <Item
              //       thumb={avatar}
              //     >{v.userNick}说：{v.msg}</Item>
              //   </List>
              // ) : (
              //   <List key={v.userNick}>
              //     <Item
              //       thumb={avatar}
              //     >{v.userNick}说：{v.msg}</Item>
              //   </List>
              // )

            })}
          </div>
        </div>
{/*游戏界面*/}
        <div>
          <Game />
        </div>

        {/*脚部输入框*/}
        <div>
          <Chat
            ref={el => this.chat = el}
            className="my-chat-box"
            dataSource={messages}
            userInfo={userInfo}
            value={inputValue}
            sendMessage={this.sendMessage}
            timestamp={timestamp}
            placeholder="请输入"
            messageListStyle={{width: '950px', height: '95px'}}
          />
        </div>

      </div>
    );
  }
}
const revMessage = (message) => {
  console.log('========================')
  console.log(message)
  const c = JSON.parse(message.content);
  console.log(c.name)
  const {dispatch} = that.props;
  dispatch({
    type: 'myMessage/updateMessage',
    payload: {
      msg: c.value,
      userNick: c.name,
      avatar: c.avatar,
      timestamp: message.time,
    }
  });
}
const getChatRoom = (userName) => {
  console.log('============getChatRoom============' + userName)
  const req = '/server/api/game/getChatRoomChannel?userName='+userName;
  fetch(req).then(response=>{
    return response.json()
    }).then((respone)=>{
    console.log(respone) //请求到的数据
    chatRoomChannel=respone.data;
  })
}
const userLeaveGame = (userName) => {
  console.log('============userLeaveGame============' + userName)
  const req = '/server/api/game/userLeaveGame?userName='+userName;
  fetch(req).then(response=>{
    return response.json()
  }).then((respone)=>{
    console.log(respone) //请求到的数据
    chatRoomChannel=respone.data;
    console.log('----'+chatRoomChannel) //请求到的数据

  })
}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
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

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

