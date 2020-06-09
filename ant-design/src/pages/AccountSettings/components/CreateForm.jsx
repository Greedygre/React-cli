import React from 'react';
import {Form, message, Modal, Radio} from 'antd';
import {connect} from "umi";
const FormItem = Form.Item;
const CreateForm = props => {
  const { modalVisible, onCancel } = props;
  const currentUser = props;
  console.log(currentUser);
  return (
    <div>

    <Modal
      destroyOnClose
      title="当前绑定情况"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
    <Form>
      <Form.Item>
        {typeof currentUser.email!=='undefined'?("当前绑定邮箱为："+currentUser.email):"当前没有绑定的邮箱"}
      </Form.Item>
    </Form>
      {props.children}
    </Modal>
    </div>
  );
};

export default connect(({ myLogin }) => ({
  currentUser: myLogin.data,
}))(CreateForm);
