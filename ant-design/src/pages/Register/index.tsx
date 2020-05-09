import React from 'react';
import styles from './index.less';
import {Form, Input, Button, Checkbox} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {connect} from "umi";

//注册表单
//填入昵称，密码，性别的信息；密码使用md5加密
const NormalRegisterForm = (props) => {

  const onFinish = (values) => {
    const {dispatch, userRegister} = props;
    console.log('Received values of register form: ', values);
    values.sex = sex;
    console.log('after Received values of register form: ', values);

    dispatch({
      type: 'myRegister/fetchRegisterUser',
      payload: {...values},
    });
  };
   var sex = 0;

  return (
    <Form
      name="normal_register"
      className="login-form"
      initialValues={{remember: true}}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{required: true, message: '请输入昵称!'}]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
               maxLength={18}
               placeholder="昵称,不能包含数字和‘@’字符"/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{required: true, message: '请输入密码!'}]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon"/>}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item
        name="sex">
        <input id="man" type="radio"  name="sex" onChange = {()=>{sex=1;console.log("???");} } />男
        <input id="woman" type="radio"   name="sex" onChange = {()=>{sex=0;console.log(sex);}}/>女
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="register-form-button">
          注册
        </Button>
      </Form.Item>
    </Form>
  );

};

export default connect(({myRegister, loading}) => ({
  userRegister: myRegister,
  submitting: loading.effects['myRegister/fetchRegisterUser'],
}))(NormalRegisterForm);
