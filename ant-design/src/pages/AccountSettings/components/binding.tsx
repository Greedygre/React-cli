import { FormattedMessage, formatMessage } from 'umi';
import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import {Form, Avatar, Button, Divider, Dropdown, Input, List, Menu} from 'antd';
import React, {Component, Fragment, useRef, useState} from 'react';
import styles from './BaseView.less';
import CreateForm from './CreateForm';
import CreateForm2 from './CreateForm2';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import ProTable from "@ant-design/pro-table";

const BindingView = () => {

  const getData =  [
    {
      title: '绑定邮箱',
      description: '进行邮箱绑定，绑定后可使用邮箱登录',
      actions: [<Button type="primary" onClick={() => handleModalVisible(true)}>绑定
      </Button>],
      avatar: <Avatar size="large" className={styles.avatar} src={require(`../../img/email.jpg`)} alt="avatar" />,
    },
    {
      title: '绑定手机号',
      description: '进行手机号绑定，绑定后可使用手机号登录',
      actions:  [<Button type="primary" onClick={() => handleModalVisible2(true)}>绑定
      </Button>],
      avatar: <Avatar size="large" className={styles.avatar} src={require(`../../img/phone.jpg`)} alt="avatar" />,
    },
  ];
  const columns = [
    {
      title: '需要绑定的邮箱',
      dataIndex: 'email',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },]
  const columns2 = [
    {
      title: '需要绑定的手机号',
      dataIndex: 'phoneNumber',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },]
  const [createModalVisible, handleModalVisible] = useState(false);
  const [createModalVisible2, handleModalVisible2] = useState(false);


    return (
      <div>
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable
            onSubmit={async value => {
              console.log(value.email);
              // const success = await handleAdd(value);
              //
              // if (success) {
              //   handleModalVisible(false);
              //
              //   if (actionRef.current) {
              //     actionRef.current.reload();
              //   }
              // }
            }}
            rowKey="key"
            type="form"
            columns={columns}
            rowSelection={{}}
          />
        </CreateForm>
        <CreateForm2 onCancel={() => handleModalVisible2(false)} modalVisible={createModalVisible2}>
          <ProTable
            onSubmit={async value => {
              console.log(value);
              // const success = await handleAdd(value);
              //
              // if (success) {
              //   handleModalVisible(false);
              //
              //   if (actionRef.current) {
              //     actionRef.current.reload();
              //   }
              // }
            }}
            rowKey="key"
            type="form"
            columns={columns2}
            rowSelection={{}}
          />
        </CreateForm2>
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={getData}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
                actions={item.actions}
              />
            </List.Item>
          )}
        />

      </Fragment>
      </div>
    );

}


export default BindingView;
