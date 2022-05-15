import React, { useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, Form, Input, Modal, Spin,
} from 'antd';
import styles from './style.module.scss';
import {
  AddDelegationInfo, UpdateDelegationInfo,
} from '@/services/entities';
import { ServicesApi } from '@/services/services-api';

const cx = classNames.bind(styles);

export interface DelegationAddOrEditProps {
  initData?: UpdateDelegationInfo;
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

const { UpdateDelegation, AddDelegation } = ServicesApi;

const UpdateOrAddDelegation: React.FC<DelegationAddOrEditProps> = ({
  isEdit, createBy = 0, createName, visible, closeEvent, initData,
}) => {
  const [pending, setPending] = useState(false);
  const initAddData: AddDelegationInfo = {
    createBy,
    createName,
    email: '',
    phone: '',
    userName: '',
    bugAddress: '',
    bugDate: '',
    bugDescription: '',
    buyDate: '',
    carModel: '',
    userRequire: '',
  };
  /* eslint-enable no-template-curly-in-string */
  const onFinish = (values: any) => {
    setPending(true);
    if (isEdit) {
      UpdateDelegation(
        {
          ...values,
          id: initData?.id,
          updateBy: initData?.updateBy,
          updateName: initData?.updateName,
        },
      ).then((res) => {
        setPending(false);
        if (closeEvent) {
          closeEvent(false);
        }
      }).catch((err) => {
        // TODO
      });
    } else {
      AddDelegation({ ...values, createBy, createName }).then((res) => {
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
      title={isEdit ? '编辑委托' : '新增委托'}
      footer={[]}
      onCancel={() => {
        if (closeEvent) {
          closeEvent(true);
        }
      }}
    >
      <Spin spinning={pending} tip="loading...">
        <Form {...layout} initialValues={isEdit ? initData : initAddData} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name="bugAddress" label="故障地址">
            <Input />
          </Form.Item>
          <Form.Item name="bugDate" label="故障日期">
            <Input />
          </Form.Item>
          <Form.Item name="bugDescription" label="故障描述" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="buyDate" label="购买日期">
            <Input />
          </Form.Item>
          <Form.Item name="carModel" label="汽车型号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="用户邮箱">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="用户电话">
            <Input />
          </Form.Item>
          <Form.Item name="userName" label="用户名称">
            <Input />
          </Form.Item>
          <Form.Item name="userRequire" label="用户要求">
            <Input />
          </Form.Item>
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

export default UpdateOrAddDelegation;
