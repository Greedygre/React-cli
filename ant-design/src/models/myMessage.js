
export default {
  namespace: 'myMessage',
  state :{
    messages: [],
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
