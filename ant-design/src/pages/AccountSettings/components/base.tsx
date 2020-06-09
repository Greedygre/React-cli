import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';
import { CurrentUser } from '../data.d';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';
var score=null;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({ avatar }: { avatar: string }) => (
<>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      {/*<img src={require(`${avatar}`)}  alt="avatar" />*/}
      {/**/}
      <img src={require(`../../img/${avatar}`)}  alt="avatar" />

    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          {/*<UploadOutlined />*/}
          修改头像
        </Button>
      </div>
    </Upload>
  </>
);

interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;

  if (!province.key) {
    callback('Please input your province!');
  }

  if (!city.key) {
    callback('Please input your city!');
  }

  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('Please input your area code!');
  }

  if (!values[1]) {
    callback('Please input your phone number!');
  }

  callback();
};

interface BaseViewProps {
  currentUser?: CurrentUser;
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getAvatarURL() {
    const { userLogin } = this.props;

    if (userLogin) {
      if (userLogin.data.avatar) {
        console.log(userLogin.data.avatar);
        return `${userLogin.data.avatar}`;
      }
      const url =
        '62f24a8af50d4f329644275e0efbfbff.jpeg';
      return url;
    }

    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = () => {
    message.success('更新基本信息成功');
  };

  render() {
    const {  userLogin } = this.props;

    console.log(userLogin.data);
    const req = '/server/api/user/getUserByName?userName='+userLogin.data.name;
    fetch(req).then(response=>{
      return response.json()
    }).then((respone)=>{
      if (respone.success){
        score=respone.data;
console.log(score);
      }else {
        message.info(respone.message);
      }})
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={userLogin}
            hideRequiredMark
          >
            <Form.Item name="email" label="邮箱">
              <p>{userLogin.data.email}</p>
            </Form.Item>
            <Form.Item name="name" label="昵称">
              <Input placeholder={userLogin.data.name} maxLength={24} />
            </Form.Item>
            <Form.Item name="profile" label="个人简介">
              <Input.TextArea placeholder={userLogin.data.signature} rows={4} maxLength={140} />
            </Form.Item>

            <Form.Item name="phone" label="手机号">
              <p>{userLogin.data.phoneNumber}</p>
            </Form.Item>
            <Form.Item name="phone" label="分数">
              <p>{score}</p>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                更新信息
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect(
  ({
    accountSettings,
    myLogin,
  }: {
    accountSettings: {
      currentUser: CurrentUser;
    };
    myLogin;
  }) => ({
    currentUser: accountSettings.currentUser,
    userLogin: myLogin,
  }),
)(BaseView);
