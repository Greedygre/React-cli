import React from 'react';
import {Form, Modal, Radio} from 'antd';
const FormItem = Form.Item;
const CreateForm = props => {
  const { modalVisible, onCancel } = props;
  return (
    <div>

    <Modal
      destroyOnClose
      title="有对局正在进行..."
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >

      {props.children}
    </Modal>
    </div>
  );
};

export default CreateForm;
