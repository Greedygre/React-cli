import {
  userlogin
} from "@/services/myLogin";
import {message} from 'antd';
import {HashRouter as Router, Link, Redirect, Route} from 'react-router-dom';
import {history} from "umi";

export default {
  namespace: 'myMessage',
  state :{
    inputValue: '',
    messages: [],
    timestamp: new Date().getTime()
  },

  effects: {
    * updateMessage(payload, {call, put}) {
      console.log(payload);
      //拉取登录信息数据
      // const pw = md5(payload.password);
      // payload.password=pw;
      //const res = yield call(userlogin, payload);
     // console.log(res);

        yield put({
          type: 'show',
          payload:payload
        });


    },


  },
  reducers: {
    show(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  }
}
