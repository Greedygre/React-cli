import React, {Component} from 'react';
import Chat from 'chat-react';
import {ReactDOM} from 'react';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {history} from "umi";
import {connect} from 'dva'
// 在index.js文件里，引入global.js，并初始化一个全局GoEasy对象
import GoEasy from 'goeasy';
import g from '../global.js'
import Game from '../Game'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'
import {GridContent} from "@ant-design/pro-layout";
import {message} from "antd";
import styles from '../AccountSettings/style.less';
var that = null;
var userName = null;
var chatRoomChannel = 'default';
// g.goEasy = new GoEasy({
//   host: 'hangzhou.goeasy.io',//应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
//   appkey: "BC-6ffc39fa9de840079599baf44bfe1c50",//替换为您的应用appkey
//   onConnected: function () {
//     console.log('连接成功！')
//   },
//   onDisconnected: function () {
//     //连接断开时调用后端方法
//     console.log('连接断开！')
//   },
//   onConnectFailed: function (error) {
//     console.log('连接失败或错误！')
//   }
// });
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
  getChannel(userName){
    if (userName!=='default'&&userName!==null){
      console.log('============getChatRoom============' + userName)
      const req = '/server/api/game/getGameChannel?userName='+userName;
      fetch(req).then(response=>{
        return response.json()
      }).then((respone)=>{
        if (respone.success){
          console.log(respone);
          const channels = JSON.parse(respone.data);
          console.log(channels.chatChannel);
          chatRoomChannel=channels.chatChannel;

          g.gameChannel=channels.gameChannel;
          g.goEasy.subscribe({
            channel: channels.chatChannel,// 聊天室的channel为对战玩家的昵称
            onMessage: function (msg) {
              console.log(msg);
              //订阅聊天室管道并更新聊天列表
              revMessage(msg);
            }
          });
        }else {
          message.info(respone.message);
        }

      })

    }
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

    g.goEasy.publish({
      channel: chatRoomChannel, //替换为您自己的channel
      message: JSON.stringify({
        value: v.value,
        timestamp: v.timestamp,
        name: v.userInfo.name,
        avatar: v.userInfo.avatar
      })//替换为您想要发送的消息内容
    });
    console.log("sendMessage");
  }


  render() {
    that = this;
   // getChatRoom(userName)

    const {myLogin, myMessage} = this.props;
    const {inputValue, messages, timestamp} = this.state;
    const userInfo = {
      avatar: (typeof myLogin.data.avatar != 'undefined') ? myLogin.data.avatar : g.avatar,
      name: myLogin.data.name,
      signature: myLogin.data.signature,
    };
    userName = userInfo.name;
    this.getChannel(userName);
    const Item = List.Item
    //聊天消息
    const chatmsgs = myMessage.messages;

    console.log("chatmsgs");
    console.log(chatmsgs);

    return (
      <div>
        <GridContent>
          <div
            className={styles.main}
            ref={(ref) => {
              if (ref) {
                this.main = ref;
              }
            }}
          >
            <div className={styles.leftMenu}>
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

                  })}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              {/*游戏界面*/}
              <div>
                <Game />
              </div>
            </div>
          </div>
        </GridContent>



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

// const getChatRoom = (userName) => {
//   console.log(userName);
//   if (userName!=="default"||userName!=='null'||userName!==null){
//     console.log('============getChatRoom============' + userName)
//     const req = '/server/api/game/getChatRoomChannel?userName='+userName;
//     fetch(req).then(response=>{
//       return response.json()
//     }).then((respone)=>{
//       if (respone.success){
//         chatRoomChannel=respone.data;
//       }else {
//         message.info(respone.message);
//       }
//
//     })
//   }
//
// }
const userLeaveGame = (userName) => {
  console.log('============userLeaveGame============' + userName)
  const req = '/server/api/game/userLeaveGame?userName='+userName;
  fetch(req).then(response=>{
    return response.json()
  }).then((respone)=>{
    if (respone.success){
      chatRoomChannel=respone.data;
    }else {
      message.info(respone.message);
    }

  })
}



// ========================================
