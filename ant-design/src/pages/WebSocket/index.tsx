import React, { Component } from 'react';
import Chat from 'chat-react';
import {Form, Input, Button, Checkbox} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import { history} from "umi";
import {connect} from 'dva'
import {json} from "express";
import {stringify} from "qs";
// 在index.js文件里，引入global.js，并初始化一个全局GoEasy对象
import GoEasy from 'goeasy';
import g from '../global.js'

g.goEasy = new GoEasy({
  host:'hangzhou.goeasy.io',//应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
  appkey: "BC-6ffc39fa9de840079599baf44bfe1c50",//替换为您的应用appkey
  onConnected: function() {
    console.log('连接成功！')
  },
  onDisconnected: function() {
    console.log('连接断开！')
  },
  onConnectFailed: function(error) {
    console.log('连接失败或错误！')
  }
});
g.goEasy.subscribe({
  channel: "chatRoom",// 聊天室的channel为对战玩家的昵称
  onMessage: function (message) {
    //订阅聊天室管道并更新聊天列表
    //console.log(message.content);
  }
});

@connect(({myLogin}) => ({
  myLogin,
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
    //v的内容包含value，时间戳，用户信息
    //value: "😏", timestamp: 1589297437337, userInfo: avatar: "http://img.binlive.cn/6.png"
    // name: "ricky"
    // userId: "a59e454ea53107d66ceb0a59
    console.log(v)
    g.goEasy.publish({
      channel: "chatRoom", //替换为您自己的channel
      message: {
        value:v.value,
        timestamp: v.timestamp,
        name:v.userinfo.name,
        avatar:v.userinfo.avatar
      } //替换为您想要发送的消息内容
    });
  }
  render() {
     const {myLogin} = this.props;
     const {inputValue, messages, timestamp} = this.state;
     console.log(myLogin.data.pictureAddress);
    const userInfo = {
      avatar: (typeof myLogin.data.pictureAddress != 'undefined')?myLogin.data.pictureAddress:g.avatar,
      name: myLogin.name,
      signature:myLogin.signature,
    };
    return (
<div>
  <div>
    <p>聊天室</p>
  </div>
  <div>
    <img src={userInfo.avatar} alt="avatar" />
  </div>
  <div>

  </div>
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
