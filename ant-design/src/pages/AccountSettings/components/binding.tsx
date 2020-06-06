import { FormattedMessage, formatMessage } from 'umi';
import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import {Avatar, List} from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './BaseView.less';
class BindingView extends Component {
  getData = () => [
    {
      title: '绑定邮箱',
      description: '进行邮箱绑定，绑定后可使用邮箱登录',
      actions: [<a key="Bind">绑定</a>],
      avatar: <Avatar size="large" className={styles.avatar} src={require(`../../img/email.jpg`)} alt="avatar" />,
    },
    {
      title: '绑定手机号',
      description: '进行手机号绑定，绑定后可使用手机号登录',
      actions: [<a key="Bind">绑定</a>],
      avatar: <Avatar size="large" className={styles.avatar} src={require(`../../img/phone.jpg`)} alt="avatar" />,
    },
  ];

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default BindingView;
