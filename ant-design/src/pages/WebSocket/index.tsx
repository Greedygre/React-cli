import React, {Component} from 'react';
import Chat from 'chat-react';
import {Form, Input, Button, Checkbox} from 'antd';
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
g.goEasy = new GoEasy({
  host: 'hangzhou.goeasy.io',//应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
  appkey: "BC-6ffc39fa9de840079599baf44bfe1c50",//替换为您的应用appkey
  onConnected: function () {
    console.log('连接成功！')
  },
  onDisconnected: function () {
    console.log('连接断开！')
  },
  onConnectFailed: function (error) {
    console.log('连接失败或错误！')
  }
});
g.goEasy.subscribe({
  channel: "chatRoom",// 聊天室的channel为对战玩家的昵称
  onMessage: function (msg) {
    //msg格式
    //{time: 1589305201310, channel: "chatRoom", content: "{"value":"🙉","timestamp":1589305201774,"name":"lu…ad/news/image/20200421/20200421121630_33367.jpg"}"}
    // channel: "chatRoom"
    // content: "{"value":"🙉","timestamp":1589305201774,"name":"lulala","avatar":"http://img.52z.com/upload/news/image/20200421/20200421121630_33367.jpg"}"
    // time: 1589305201310
    console.log(msg);
    //订阅聊天室管道并更新聊天列表
    revMessage(msg);
  }
});

@connect(({myLogin, myMessage,loading}) => ({
  myLogin,
  myMessage,
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
  sendMessage = (v) =>{
    //v的内容包含value，时间戳，用户信息
    //value: "😏", timestamp: 1589297437337, userInfo: avatar: "http://img.binlive.cn/6.png"
    // name: "ricky"
    // userId: "a59e454ea53107d66ceb0a59

    g.goEasy.publish({
      channel: "chatRoom", //替换为您自己的channel
      message: JSON.stringify({
        value: v.value,
        timestamp: v.timestamp,
        name: v.userInfo.name,
        avatar: v.userInfo.avatar
      } )//替换为您想要发送的消息内容
    });
  }

  render() {
    that=this;
    const {myLogin, myMessage} = this.props;
    const {inputValue, messages, timestamp} = this.state;
    const userInfo = {
      avatar: (typeof myLogin.data.pictureAddress != 'undefined') ? myLogin.data.pictureAddress : g.avatar,
      name: myLogin.data.name,
      signature: myLogin.data.signature,
    };
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
            {'皮卡丘'}
          </NavBar>
          <div className='chat-content'>
            {chatmsgs.map(v => {
              //用户头像
              //const avatar = require(userInfo.avatar)
              const avatar = require(`../img/bear.png`)
              console.log("chat-->msg",v);
              return v.from === "userid" ? (
                <List key={v.userNick}>
                  <Item
                    thumb={avatar}
                  >{v.msg}</Item>
                </List>
              ) : (

                <List key={v.userNick}>
                  <Item
                    extra={<img alt='头像' src={avatar}/>}
                    className='chat-me'>{v.msg}</Item>
                </List>
              )

            })}
          </div>
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
const revMessage =(message)=> {
  console.log('========================')
  console.log(message)
  const c = JSON.parse(message.content);
  console.log(c.name)
    const {dispatch} = that.props;
    dispatch({
      type: 'myMessage/updateMessage',
      payload: {
        msg:c.value,
        userNick:c.name,
        avatar: c.avatar,
        timestamp: message.time,
      }
    });
}
