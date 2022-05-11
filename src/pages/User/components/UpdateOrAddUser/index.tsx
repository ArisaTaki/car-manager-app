import React, { useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, Form, Input, Modal, Radio, RadioChangeEvent, Spin,
} from 'antd';
import styles from './style.module.scss';
import { AddUserInfo, UserInfoDetails } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';

const cx = classNames.bind(styles);

export interface UserAddOrEditProps {
  initData?: UserInfoDetails;
  isEdit?: boolean;
  visible?: boolean;
  closeEvent?: (closeOnly?: boolean) => void;
  createBy?: number;
  createName?: string;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const { UpdateUser, AddUser } = ServicesApi;

const UpdateOrAddUser: React.FC<UserAddOrEditProps> = ({
  isEdit, createBy = 0, createName, visible, closeEvent, initData,
}) => {
  const [pending, setPending] = useState(false);
  const [type, setType] = useState();
  const initAddData: AddUserInfo = {
    createBy,
    createName,
    email: '',
    password: '',
    phone: '',
    type: 0,
    userName: '',
    userTitle: '',
  };

  const onChange = (e:RadioChangeEvent) => {
    setType(e.target.value);
  };

  /* eslint-enable no-template-curly-in-string */
  const onFinish = (values: any) => {
    setPending(true);
    if (isEdit) {
      UpdateUser({ ...values, userId: initData?.userId }).then((res) => {
        setPending(false);
        if (closeEvent) {
          closeEvent(false);
        }
      }).catch((err) => {
        // TODO
      });
    } else {
      AddUser({ ...values, createBy }).then((res) => {
        setPending(false);
        if (closeEvent) {
          closeEvent(false);
        }
      }).catch((err) => {
        // TODO
      });
    }
  };

  return (
    <Modal
      maskClosable={false}
      visible={visible}
      title={isEdit ? '编辑用户' : '新增用户'}
      footer={[]}
      onCancel={() => {
        if (closeEvent) {
          closeEvent(true);
        }
      }}
    >
      <Spin spinning={pending} tip="loading...">
        <Form {...layout} initialValues={isEdit ? initData : initAddData} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机">
            <Input />
          </Form.Item>
          <Form.Item name="userTitle" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {!isEdit ? (
            <>
              <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="userName" label="用户名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="createName" label="创建者">
                <Input disabled />
              </Form.Item>
              <Form.Item name="type" label="种类" rules={[{ required: true }]}>
                <Radio.Group onChange={onChange} value={type}>
                  <Radio value={0}>管理员</Radio>
                  <Radio value={1}>客服</Radio>
                  <Radio value={2}>经理</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          ) : null}
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 12 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdateOrAddUser;
