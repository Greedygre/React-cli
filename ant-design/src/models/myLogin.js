import {
  userlogin
} from "@/services/myLogin";
import {message} from 'antd';
import {HashRouter as Router, Link, Redirect, Route} from 'react-router-dom';
import {history} from "umi";
import {getPageQuery} from "@/utils/utils";
import {stringify} from "querystring";
import g from "../pages/global.js";
export default {
  namespace: 'myLogin',
  state: {
    data: {
      name: 'default',
      phoneNumber: [],
      email: [],
      sex: [],
      score: [],
      signature: [],
      avatar: g.avatar},           //后台返回的身份列表数据
    success: [],
    code: [],
    message: []
  },

  effects: {
    * fetchLoginUser(payload, {call, put}) {
      console.log(payload);
      //拉取登录信息数据
      const res = yield call(userlogin, payload);
      console.log(res);
      if (res.success) {
        yield put({
          type: 'show',
          payload:{
            data: {
              name: res.data.name,
              phoneNumber: res.data.phoneNumber,
              email: res.data.email,
              sex: res.data.sex,
              score: res.data.score,
              signature: res.data.signature,
              avatar: res.data.pictureAddress
            },
            success: res.success,
            code:res.code,
            message:res.message
          }
        });
        g.name=res.data.name;
       history.replace("/account/settings");
      } else {
        message.warning(res.message);
      }
    },
    *logout(_, { put}) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      yield put({
        type: 'show',
        payload:{
          data: {
            name: [],
            phoneNumber: [],
            email: [],
            sex: [],
            score: [],
            signature: [],
            avatar: g.avatar
          }
        }
      });
      if (window.location.pathname !== '/user/login' && !redirect) {

        history.replace({
          pathname: '/welcome',
          search: stringify({
            redirect: window.location.href,
          }),
        });
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
