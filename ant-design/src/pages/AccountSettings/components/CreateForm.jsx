import React from 'react';
import {Form, Modal, Radio} from 'antd';
const FormItem = Form.Item;
const CreateForm = props => {
  const { modalVisible, onCancel } = props;
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
        当前绑定邮箱为：
      </Form.Item>
    </Form>
      {props.children}
    </Modal>
    </div>
  );
};

export default CreateForm;
