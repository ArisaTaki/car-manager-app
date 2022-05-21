import React, { useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, DatePicker, Dropdown, Form, Input, Menu, message, Modal, Select, Space, Spin,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { GetPartDetailProps, RepairInfoBase } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';
import { formatRole } from '@/utils/Role';

const cx = classNames.bind(styles);

export interface DelegationAddOrEditProps {
  visible?: boolean;
  closeEvent?: (closeOnly?: boolean) => void;
  createBy?: number;
  createName?: string;
  commissionId: number;
  partList: GetPartDetailProps[];
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
  createBy, createName, visible, closeEvent, commissionId, partList,
}) => {
  const [pending, setPending] = useState(false);
  const [partListApi, setPartListApi] = useState<{ count: number, partId: number }[]>([]);
  const initAddData: RepairInfoBase = {
    repairDate: '',
    repairStation: '',
  };
    /* eslint-enable no-template-curly-in-string */
  const onFinish = (values: any) => {
    setPending(true);
    AddRepair({
      ...values, createBy, createName, commissionId, partList: partListApi,
    }).then((res) => {
      if (res.code !== '500') {
        message.success(res.message);
      }
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
        <div style={{ display: 'flex', marginBottom: 10 }}>
          <div style={{ width: 50 }}>部位：</div>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
            onChange={(e) => {
              setPartListApi(e.map((item: string, index: number) => ({
                count: 1,
                partId: Number(item),
              })));
            }}
          >
            {partList.map((item, index) => (
              <Select.Option key={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
        </div>

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
