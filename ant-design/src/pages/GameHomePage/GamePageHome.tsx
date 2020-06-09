import React, {Fragment, useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {message, Button, Modal, Form, List} from 'antd';
import styles from '../Welcome.less';
import Login from '../Login';
import {connect, history} from "umi";
import g from "@/pages/global";
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import HeaderDropdown from "@/components/HeaderDropdown";
import GoEasy from "@/components/GlobalHeader/goeasy";
import ProTable from "@ant-design/pro-table";
import HaveGame from './HaveGame'
import Ticker from './Ticker'
import {ReactDOM} from 'react';
const GamePageHome =props => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [createModalVisible2, handleModalVisible2] = useState(false);

  const handleStartGame =()=>{
  const currentUser = props;
  console.log(currentUser.currentUser);
    const req = '/server/api/game/startGame?userName='+currentUser.currentUser.name;
    fetch(req).then(response=>{
      return response.json()
    }).then((respone)=>{
      console.log(respone) //请求到的数据
      if (respone.success){
        if (respone.data==="have game"){
          // 当前有对局正在进行
          console.log("have game")
          handleModalVisible(true)
        }else {
          // 读条
          handleModalVisible2(true)
        }
      }
    })
  }
  const handleIntoGame =()=>{
    history.replace("/account/webSocket");
  }
  const handleEndGame =()=>{
    console.log(props.currentUser.name);
    const req = '/server/api/game/endGame?userName='+props.currentUser.name;
    fetch(req).then(response=>{
      return response.json()
    }).then((respone)=>{
      console.log(respone) //请求到的数据
      if (respone.success){
        message.info("请重新匹配游戏");
        handleModalVisible(false);
      }
    })
  }
  const getData =  [
    {
      title: '进入正在进行的对局',
      actions: [<Button type="primary" onClick={() => handleIntoGame()}>进入
      </Button>],
    },
    {
      title: '结束对局',

      actions:  [<Button type="primary" onClick={() => handleEndGame()}>结束
      </Button>],
    },
  ];
    return (

        <div>
          <p>游戏大厅</p>

          <Button type="primary" onClick={() => handleStartGame()}>开始匹配游戏
        </Button>
          <HaveGame onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
            <Fragment>
              <List
                itemLayout="horizontal"
                dataSource={getData}
                renderItem={(item) => (
                  <List.Item actions={item.actions}>
                    <List.Item.Meta
                      avatar={item.avatar}
                      title={item.title}
                      description={item.description}
                      actions={item.actions}
                    />
                  </List.Item>
                )}
              />

            </Fragment>
          </HaveGame>
          <Ticker onCancel={() => {
            handleModalVisible2(false);

          }} modalVisible={createModalVisible2}>
            </Ticker>
        </div>

      )


}

export default connect(({ myLogin }) => ({
  currentUser: myLogin.data,
}))(GamePageHome);
