import {getChatRoomChannel} from "@/services/myMessage";
import {message} from "antd";

export default {
  namespace: 'myMessage',
  state :{
    messages: [],
    channel:'default',
  },

  effects: {
    * updateMessage(payload, { put}) {
      console.log("+++++++++++++++++++++++++++");
      console.log(payload);
        yield put({
          type: 'show',
          payload:payload.payload,
        });


    },
    //获取玩家所在聊天室频道
    * getChatRoomChannel(payload, { call,put}) {
      const res = yield call(getChatRoomChannel, payload);
      console.log("getChatRoomChannel");
      console.log(payload);
      if (res.success) {
        console.log('getChatRoomChannel success')
        yield put({
          type: 'show',
          payload:{
            channel: res.data
          }
        });
      }else {
        message.warning(res.message);
      }



    },
  },
  reducers: {
    show(state, {payload}) {
      console.log(payload);
      state.messages.push({
      //   let {dataSource = []} = this.state;
      // dataSource.push({key:'1',data:'1'});
      // this.setState({dataSource});
          msg:payload.msg,
          userNick:payload.userNick,
          avatar: payload.avatar,
          timestamp: payload.timestamp,
      });
      console.log("state");
      console.log(state);
      return {
        ...state,
        ...payload,
      };
    },
  }
}
