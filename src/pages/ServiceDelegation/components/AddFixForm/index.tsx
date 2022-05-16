import React, { useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, DatePicker, Form, Input, message, Modal, Spin,
} from 'antd';
import styles from './style.module.scss';
import {
  AddDelegationInfo, RepairInfoBase, UpdateDelegationInfo, UpdateDelegationInfoByMoment,
} from '@/services/entities';
import { ServicesApi } from '@/services/services-api';

const cx = classNames.bind(styles);

export interface DelegationAddOrEditProps {
  visible?: boolean;
  closeEvent?: (closeOnly?: boolean) => void;
  createBy?: number;
  createName?: string;
  commissionId: number;
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

const { AddRepair } = ServicesApi;

const AddFixForm: React.FC<DelegationAddOrEditProps> = ({
  createBy, createName, visible, closeEvent, commissionId,
}) => {
  const [pending, setPending] = useState(false);
  const initAddData: RepairInfoBase = {
    repairDate: '',
    repairStation: '',
  };
    /* eslint-enable no-template-curly-in-string */
  const onFinish = (values: any) => {
    setPending(true);
    AddRepair({
      ...values, createBy, createName, commissionId,
    }).then((res) => {
      message.success(res.message);
      setPending(false);
      if (closeEvent) {
        closeEvent();
      }
    }).catch((err) => {
      // TODO
    });
  };

  return (
    <Modal
      maskClosable={false}
      visible={visible}
      title="新加维修单"
      footer={[]}
      onCancel={() => {
        if (closeEvent) {
          closeEvent();
        }
      }}
    >
      <Spin spinning={pending} tip="loading...">
        <Form {...layout} initialValues={initAddData} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name="repairStation" label="维修站">
            <Input />
          </Form.Item>
          <Form.Item name="repairDate" label="故障日期" rules={[{ required: true }]}>
            <DatePicker />
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
export default AddFixForm;
