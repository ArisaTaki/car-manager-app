import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, Form, Input, message, Modal, RadioChangeEvent, Spin,
} from 'antd';
import moment from 'moment';
import styles from './style.module.scss';
import { PartInfoBase, UserTokenKeyInfo } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';
import { getUser } from '@/utils/storageUtils';

const cx = classNames.bind(styles);

export interface PartAddOrEditProps {
  initData?: PartInfoBase;
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

const { UpdatePartInfo, AddPart } = ServicesApi;

const UpdateOrAddPart: React.FC<PartAddOrEditProps> = ({
  isEdit, createName, visible, closeEvent, initData,
}) => {
  const [pending, setPending] = useState(false);
  const [type, setType] = useState();
  const [userInfo, setUserInfo] = useState<UserTokenKeyInfo>();
  const initAddData: PartInfoBase = {
    createName,
    id: 0,
    createTime: '',
  };

  const onChange = (e: RadioChangeEvent) => {
    setType(e.target.value);
  };

  /* eslint-enable no-template-curly-in-string */
  const onFinish = (values: any) => {
    setPending(true);
    if (isEdit) {
      UpdatePartInfo({
        ...values, id: initData?.id, updateBy: userInfo?.userId, updateName: userInfo?.userName,
      }).then(
        (res) => {
          message.success(res.message);
          setPending(false);
          if (closeEvent) {
            closeEvent(false);
          }
        },
      ).catch((err) => {
        // TODO
      });
    } else {
      const date = moment().format('YYYY/MM/DD');
      AddPart({ ...values, createTime: date }).then((res) => {
        message.success(res.message);
        setPending(false);
        if (closeEvent) {
          closeEvent(false);
        }
      }).catch((err) => {
        // TODO
      });
    }
    console.log(values);
  };
  useEffect(() => {
    const user = getUser();
    setUserInfo(user);
  }, []);
  return (
    <Modal
      maskClosable={false}
      visible={visible}
      title={isEdit ? '编辑零件' : '新增零件'}
      footer={[]}
      onCancel={() => {
        if (closeEvent) {
          closeEvent(true);
        }
      }}
    >
      <Spin spinning={pending} tip="loading...">
        <Form {...layout} initialValues={isEdit ? initData : initAddData} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name="name" label="零件名称">
            <Input disabled={isEdit} />
          </Form.Item>
          <Form.Item name="price" label="零件价格">
            <Input />
          </Form.Item>
          {!isEdit ? (
            <>
              <Form.Item name="createName" label="创建者">
                <Input disabled />
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

export default UpdateOrAddPart;
