import React, {Component} from 'react';

import {history} from "umi";
import {connect} from 'dva'
// 在index.js文件里，引入global.js，并初始化一个全局GoEasy对象
import GoEasy from 'goeasy';
import g from '../../pages/global.js'
import Game from '../Game'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'
import {GridContent} from "@ant-design/pro-layout";
import {message} from "antd";
import styles from '../AccountSettings/style.less';
var that = null;

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


@connect(({myLogin}) => ({
  myLogin,
}))
export default class MyChat extends Component {
  getName(){
    const myLogin = this.props;
    console.log("刷新goeasy"+myLogin);
    console.log(myLogin);
    console.log(myLogin.myLogin.data.name);
    g.goEasy.subscribe({
      channel: myLogin.myLogin.data.name,// 聊天室的channel为对战玩家的昵称
      onMessage: function (msg) {
        console.log(msg);
        if (msg.content==="game start"){
          history.replace("webSocket");
        }
      }
    });
  }
  render() {
    this.getName();
    return (
      <div>

      </div>
    );
  }
}






// ========================================


