import React from 'react';
import {Form, Modal, Radio} from 'antd';
import styles from "@/pages/Game/index.less";
import g from "@/pages/global";
var count = 0;
var start = null;
var end = null;
const Ticker = props => {

  const { modalVisible, onCancel } = props;
  return (
    <div>
      <Modal
        destroyOnClose
        title="等待中..."
        visible={modalVisible}
        onCancel={() => {onCancel();count=0;}}
        footer={null}
      >

        <HBoard></HBoard>
      </Modal>
    </div>
  );
};
class HBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      start:new Date()
    };
    // this.setState({ start: new Date() })
  }



  componentDidMount(){
    this.setState({start:new Date()})
    setTimeout(( ) => {
      this.componentDidMount();
    },1000);
  }
  render() {

    if (count===0){
      start=new Date();
      end=new Date()
      count=1;
    }
    end=new Date()

    return (
      <div>
        <h1>等待了{(Date.parse(end)-Date.parse(start))/1000}秒</h1>
      </div>
    );
  }
}

// setInterval(Ticker, 1000);
export default Ticker;
