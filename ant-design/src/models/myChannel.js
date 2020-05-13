import {getChatRoomChannel} from "@/services/myMessage";
import {message} from "antd";

export default {
  namespace: 'myChannel',
  state :{
    channel:'default',
  },

  effects: {

    //获取玩家所在聊天室频道
    * getChatRoomChannel(payload, { call,put}) {
      const res = yield call(getChatRoomChannel, payload);
      console.log("getChatRoomChannel");
      console.log(res);
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

      console.log("state");
      console.log(state);
      return {
        ...state,
        ...payload,
      };
    },
  }
}
