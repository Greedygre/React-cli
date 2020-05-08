import React, { Component, useState } from 'react';
import styles from './index.less';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { submitLoginData } from '@/services/myLogin';
import { connect, Link } from 'umi';

const NormalLoginForm = (props) => {
  const onFinish = (values) => {
    const { dispatch, userLogin } = props;
    console.log('22Received values : ', values.username, values.password);
    dispatch({
      type: 'myLogin/fetchLoginUser',
      payload: { ...values },
    });
    //从model取数据
    console.log(userLogin.data);
  };
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名/邮箱/手机号!' }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名/邮箱/手机号"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住账号</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          忘记密码
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
        <p> </p>
        <a href="/register">注册</a>
      </Form.Item>
    </Form>
  );
};

// export default () => (
//   <div className={styles.container}>
//     <div id="components-form-demo-normal-login">
//       <NormalLoginForm />
//     </div>
//   </div>
// );
//
export default connect(({ myLogin, loading }) => ({
  userLogin: myLogin,
  submitting: loading.effects['myLogin/fetchLoginUser'],
}))(NormalLoginForm);
