import {
  userlogin
} from "@/services/myLogin";
import {message} from 'antd';

export default {
  namespace: 'myLogin',
  state: {
    data: {},           //后台返回的身份列表数据
    success: [],
    code: [],
    message: []
  },

  effects: {
    * fetchLoginUser(payload, {call, put}) {
      console.log(payload);
      //异步拉取省份数据
      const res = yield call(userlogin, payload);
      console.log(res);
      if (res.success) {
        console.log("成功");
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
              pictureAddress: res.data.pictureAddress
            },
            success: res.success,
            code:res.code,
            message:res.message
          }
        });
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
