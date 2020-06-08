import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import {Avatar, Button, Menu, Spin, Upload} from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import GoEasy from './goeasy';
import g from '../../pages/global.js'

class AvatarDropdown extends React.Component {

  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'myLogin/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    g.name=currentUser.name;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu &&  <Menu.Divider />}
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (currentUser && currentUser.name ? (
      <div>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={require(`../../pages/img/${currentUser.avatar}`)} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
      <GoEasy />
      </div>

  ) : (
    <div>
       <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
      <GoEasy />
    </div>
    )

    )
  }
}

export default connect(({ myLogin }) => ({
  currentUser: myLogin.data,
}))(AvatarDropdown);
