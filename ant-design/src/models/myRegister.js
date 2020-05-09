import {
  userRegister
} from "@/services/myLogin";
import {message} from 'antd';
import {HashRouter as Router, Link, Redirect, Route} from 'react-router-dom';
import {history} from "umi";

export default {
  namespace: 'myRegister',
  state: {
    data: {},           //后台返回的身份列表数据
    success: [],
    code: [],
    message: []
  },
  effects: {
    * fetchRegisterUser(payload, {call, put}) {
      console.log(payload);
      //拉取登录信息数据
      const res = yield call(userRegister, payload);
      console.log(res);
      if (res.success) {
        console.log("成功");

        history.replace("/welcome");
      } else {
        message.warning(res.message);
      }
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
